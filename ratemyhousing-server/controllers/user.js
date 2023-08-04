require('dotenv').config()
const bcrypt = require('bcrypt');
const config = require('config');
const ServerError = require('../utils/errors/serverError');
const ResponseBody = require('../utils/respBody');
const User = require('../models/schema_user').User;
const { validateEmail } = require('../models/schema_user');
const { generateAccessToken } = require('../controllers/auth');
const clientBaseUrl = config.get('app.client.url');
const handlebars = require('handlebars');
path = require('path')
const fs = require('fs');

const emailTemplatePath = path.join(__dirname, '../utils/templates/resetpwd.html');

async function findUserfromEmail(userEmail){
    if(!userEmail || !validateEmail(userEmail))
        throw new ServerError(400,400,"Invalid email formatting");
    let user;
    try{
        user = await User.findOne({email:userEmail});
    }catch(err){
        throw new ServerError(err.code,500,"Error occurred while checking for user");
    }
    if(!user)
        throw new ServerError(404,404,"No such user found");
    return user;
}

function generateResetLink(email){
    const accessToken = generateAccessToken({email:email});
    const link =`${clientBaseUrl}/forgot?o=${accessToken}`;
    return link;
}

//Inject mailSerive as a dependency into sendEmailToUser
async function sendEmailToUser(content,to,mailService){
    return new Promise((resolve,reject)=>{
        mailService(to,content).then((info)=>{
            if(info.accepted.length>=1){
                const status = 200
                const respBody = new ResponseBody(status,info,"Mail sent successfully!",true);
                resolve(respBody);
            }else if(info.rejected.length>=1) 
                reject(new ServerError(404,404,"Email not valid"));
            else
                reject(new ServerError(500,500,"An error occurred while sending email"));
        },(err)=>{
            reject(new ServerError(500,500,err));
        });        
    });
}

async function sendResetPasswordLink(req,res,next,mailService){
    let link;
    let user;
    try{
        user = await findUserfromEmail(req.body.email);
        link =  generateResetLink(user.email);
    }catch(err){
        return next(err);
    }
    fs.readFile(emailTemplatePath,'utf-8',function(err,html) {
        let template
        if(err)
            return next(err);
        try{
            template = handlebars.compile(html);
        }catch(err){
            next(err);
        }
        let replacements = {
            username: user.name,
            resetLink: link
        }
        let mailToSend = template(replacements);
        const content = {
            subject: "RateMyHousing: Reset Password",
            html: mailToSend
        }
        sendEmailToUser(content,user.email,mailService).then((respBody)=>{
            res.status(respBody.status).json(respBody);
        },(err)=>{
            next(err);
        });
    });
}

async function resetPassword(req,res){
    const newPass = req.body.newPass;
    const userEmail = req.user.email;
    const hashedPassword = await bcrypt.hash(newPass,10);
    let user;
    try{
        user = await User.findOneAndUpdate({email: userEmail},{password: hashedPassword});
    }catch(err){
        throw new ServerError(err.code, 500, err);
    }
    if(!user)
        throw new ServerError(404,404,"No such user found");
    const status = 200;
    const respBody = new ResponseBody(status,user.email,"Password reset successfully",true);
    res.status(status).json(respBody);
}

module.exports = {
    sendResetPasswordLink,
    generateResetLink,
    resetPassword,
    sendEmailToUser,
    findUserfromEmail
};
