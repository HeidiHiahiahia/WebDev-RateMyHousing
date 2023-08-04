require('dotenv').config()
const bcrypt = require('bcrypt');
const ServerError = require('../utils/errors/serverError');
const ResponseBody = require('../utils/respBody');
const User = require('../models/schema_user').User;
const getJWTpayLoad = require('../utils/operations').getJWTpayLoad;
const jwt = require('jsonwebtoken');
const config = require('config');
const tokenExpiry = config.get('app.settings.tokens.expiry');

/**Token based login functions */
function generateAccessToken(tokenData){
    return jwt.sign(tokenData,process.env.ACCESS_TOKEN_SECRET,{expiresIn: tokenExpiry});
}


function validateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) 
        next(new ServerError(400,400,"Access token missing"));
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err)
            next(new ServerError(403,403,err.message));
        req.user = user;
        next();
    });
}

async function refreshToken(req,res){
    const refreshToken = req.body.token;
    if(refreshToken==null)
        throw new ServerError(400,400,"Access token missing");
    const tokenData = getJWTpayLoad(refreshToken);
    console.log(tokenData.email);
    const user = await User.findOne({email:tokenData.email})
    if(user){
        if(!user.tokens.includes(refreshToken)){
            throw new ServerError(401,401,"Invalid Token");
        }else{
            try{
                const userData = await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
                const accessToken = generateAccessToken({email: userData.email, name: userData.name, role: userData.role});
                const status = 200;
                const resp = new ResponseBody(status,{
                    token: accessToken
                },"New access token generated",true);
                res.status(status).send(resp); 
            }catch(err){
                throw new ServerError(500,err.code,err.message);
            }
        }
    }else{
        throw new ServerError(401,401,"Invalid Token");
    }
}

/**User login functions */
//TODO: remove refresh token from user
async function logoutUser(req,res){
        const tokenData = getJWTpayLoad(req.body.token);
        const userEmail =  tokenData.email;
        const user2Logout = await User.findOne({email: userEmail});
        if(user2Logout){
            const index = user2Logout.tokens.indexOf(req.body.token);
            if(index < 0)
                throw new ServerError(401,401,"Invalid Token");
            user2Logout.tokens.splice(index,1);
            try{
                await user2Logout.save();
            }catch(err){
                throw new ServerError(err.code,500,err.message);
            }
            const status = 200;
            const resp = new ResponseBody(status,{ deletedToken : req.body.token },"Logout Success!",true);
            res.status(status).json(resp);
        }else{
            throw new ServerError(401,401,"Invalid Token");
        }
}


async function loginUser(req,res){
    const {email , password} = req.body;
    const user2Login = await User.findOne({email: email});
    if(!user2Login){
        throw new ServerError(400,400,"Invalid Credentials",false);
    }else{
        if(await bcrypt.compare(password,user2Login.password)){
            const accessToken = generateAccessToken({email: user2Login.email, name: user2Login.name, role: user2Login.role});
            const refreshToken = jwt.sign({email:user2Login.email, name:user2Login.name, role: user2Login.role},process.env.REFRESH_TOKEN_SECRET);
            user2Login.tokens.push(refreshToken);
            try{
                await user2Login.save();
            }catch(err){
               throw new ServerError(err.code,400,err.message);
            }
            const status = 200;
            const resp = new ResponseBody(
                status,{
                    token: accessToken,
                    refreshToken: refreshToken
                },
                "User validation success",
                true
            );
            res.status(status).json(resp);

        }else{
            throw new ServerError(400,400,"Invalid Credentials",false);
        }
    }
};

async function createUser(req,res){
    const {email,name,password,phoneNo} = req.body;
    if(!email || !name || !password){
        throw new ServerError(400,400,"Email,name or password is not provided"); 
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
        email,
        name,
        password : hashedPassword,
        phoneNo
    });
    try{
        await user.save();
        const status = 201;
        const resp = new ResponseBody(status,undefined,"User creation success",true);
        res.status(status).json(resp);
    }catch(err){
        throw new ServerError(err.code,500,err.message); 
    }
};

function authRole(role){
    return (req,res,next) => {
        // console.log(req.user);
        if(req.user.role === role){
            // console.log(`Role is ${role} authorized`);
            next();
        }else{
            // console.log(`Role is ${role} not authorized`);
            next(new ServerError(401,401,"Unauthorized"));   
        }
    }
}


module.exports = {
    loginUser,
    logoutUser,
    createUser,
    validateToken,
    refreshToken,
    authRole,
    generateAccessToken
};
