const config = require('config');
const mongoose = require('mongoose');
const { User,validateEmail } = require('../models/schema_user');
const dbUrl = config.get('db.dbUrl');
const bcrypt = require('bcrypt');
const app = require('../app');
const supertest = require('supertest');
const { ROLE } = require('../models/roles');
const { getJWTpayLoad } = require('../utils/operations');
const request = supertest(app);


jest.setTimeout(10000);
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });


describe('1. Auth Utils Unit tests',()=>{
    it('Email Validation',()=>{
        const ret = validateEmail('example@test.com');
        expect(ret).toBe(true);
    });

    it('JWT payload decoding success',()=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQGV4YW1wbGUuY29tIiwibmFtZSI6InpldXMxMjMiLCJyb2xlIjoiYmFzaWMiLCJpYXQiOjE2NDgzMzE5NTd9.8Wnv4-So7eE9xQBbtTrurLBEQ6RB4FsOsESyKv6oEm8";
        const tokenData = getJWTpayLoad(token);
        expect(tokenData.email).toEqual("test1@example.com");
        expect(tokenData.name).toEqual("zeus123");
        expect(tokenData.role).toEqual(ROLE.BASIC);
    });

    it('JWT payload decoding failed',()=>{
        const token = "eyJlbWFpbCI6InRlc3QxQGV4YW1wbGUuY29tIiwibmFtZSI6InpldXMxMjMiLCJpYXQiOjE2NDgzMjc3MzF9.DKRGfv3-waoe9FZtV1aHgsTcSS45vUZz68-hHbXUp64";
        expect( ()=> { getJWTpayLoad(token) }).toThrow('Token is not JWT');
    });
})

describe('2. Auth API tests',() =>{
    beforeAll(async ()=>{
        await User.deleteMany({});
      });

    afterEach(async ()=>{
        await User.deleteMany({});
    });

    afterAll(async ()=>{
      await mongoose.connection.close();
    });


    it('1. Create user test - SignUp API',async function() {
        const res = await request.post('/auth/signup').send(
            {
                email:"test@example.com",
                name: "exampleUser1",
                password:"test123",
                phoneNo:"123-425-729"
            }
        )
        .expect(201);
        
        expect(res.body.message).toBe("User creation success");
        expect(res.body.success).toBe(true);
    });

    it('2. User login test - Login API',async function() {

        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729"
        });
        await newUser.save();

        const res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        .expect(200);
        expect(res.body.message).toBe("User validation success");
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();
        expect(res.body.success).toBe(true);
    });

    it('3. User Logout test - Logout API',async function(){
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729"
        });
        await newUser.save();

        
        let res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        let refreshToken = res.body.data.refreshToken;
        res = await request.post('/auth/logout').send(
            {
                token:refreshToken
            }
        ).expect(200);
        expect(res.body.message).toBe("Logout Success!");
        expect(res.body.data.deletedToken).toBeDefined();
        expect(res.body.success).toBe(true);
    });

    it('4. Incomplete details - missing fields - SignUP API',async ()=>{
        const res = await request.post('/auth/signup').send(
            {
                phoneNo:"123-425-729"
            }
        )
        .expect(400);
        expect(res.body.message).toBe("Email,name or password is not provided");
        expect(res.body.success).toBe(false);
    });

    it('5. Incomplete details - empty fields - SignUP API',async ()=>{
        const res = await request.post('/auth/signup').send(
            {
                email:"",
                name: "",
                password:"",
                phoneNo:"123-425-729"
            }
        )
        .expect(400);
        expect(res.body.message).toBe("Email,name or password is not provided");
        expect(res.body.success).toBe(false);
    });

    it('6. Existing User - SignUp API',async function() {
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729"
        });
        await newUser.save();

        const res = await request.post('/auth/signup').send(
            {
                email:"test@example.com",
                name: "exampleUser1",
                password:"test235",
                phoneNo:"789-425-729"
            }
        )
        .expect(500);
        expect(res.body.status).toBe(11000); //Duplicate key error
        expect(res.body.success).toBe(false);
    });

    
    it('7. Invalid credentials or non existant user - Login API',async function() {
        const res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        .expect(400);
        expect(res.body.message).toBe("Invalid Credentials");
        expect(res.body.success).toBe(false);
    });
    
    it('8. Incomplete details -empty fields- Login API',async function() {
        const res = await request.post('/auth/login').send(
            {
                email: "",
                password:""
            }
        )
        .expect(400);
        expect(res.body.message).toBe("Invalid Credentials");
        expect(res.body.success).toBe(false);
    });

    it('9. Incomplete details - missing fields - Login API',async function() {
        const res = await request.post('/auth/login')
        .expect(400);
        expect(res.body.message).toBe("Invalid Credentials");
        expect(res.body.success).toBe(false);
    });

    it('10. Same Token being to logout twice - Logout API',async function() {
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729"
        });
        await newUser.save();
        
        let res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        let refreshToken = res.body.data.refreshToken;
        res = await request.post('/auth/logout').send(
            {
                token:refreshToken
            }
        ).expect(200);

        res = await request.post('/auth/logout').send(
            {
                token:refreshToken
            }
        ).expect(401);
        expect(res.body.message).toBe("Invalid Token");
        expect(res.body.success).toBe(false);
    });

    it('11. Create user with wrong email format - SignUp API',async function() {
        const res = await request.post('/auth/signup').send(
            {
                email:"@example.com",
                name: "exampleUser1",
                password:"test123",
                phoneNo:"123-425-729"
            }
        )
        .expect(500);
        expect(res.body.success).toBe(false);
    });

    it('12. Refresh token test successful scenario - Token API',async function() {
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729",
        });
        await newUser.save();

        let res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        .expect(200);

        let refreshToken = res.body.data.refreshToken;
        
        res = await request.post('/auth/token').send(
            {
                token: refreshToken
            }
        )
        .expect(200);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.message).toBe("New access token generated");
        expect(res.body.success).toBe(true);
    });

    it('13. Refresh token test - invalid token of existing user- Token API',async function() {
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729",
        });
        await newUser.save();

        let res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        .expect(200);

        let refreshToken = res.body.data.refreshToken;
        
        res = await request.post('/auth/logout').send(
            {
                token: refreshToken
            }
        )
        .expect(200);

        res = await request.post('/auth/token').send(
            {
                token: refreshToken
            }
        )
        .expect(401);
        expect(res.body.message).toBe("Invalid Token");
        expect(res.body.success).toBe(false);
    });

    it('14. Refresh token test - invalid token of non existing user - Token API',async function() {
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729",
        });
        await newUser.save();

        let res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        .expect(200);

        let refreshToken = res.body.data.refreshToken;

        await User.findByIdAndDelete(newUser.id);
        
        res = await request.post('/auth/token').send(
            {
                token: refreshToken
            }
        )
        .expect(401);
        expect(res.body.message).toBe("Invalid Token");
        expect(res.body.success).toBe(false);
    });
    
    it('15. Refresh token test - No token sent -Token API',async function() {
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729",
        });
        await newUser.save();

        let res = await request.post('/auth/login').send(
            {
                email: "test@example.com",
                password:"test123"
            }
        )
        .expect(200);        
        res = await request.post('/auth/token')
        .expect(400);
        expect(res.body.message).toBe("Access token missing");
        expect(res.body.success).toBe(false);
    });

    describe('Permissions tests',()=>{

        it('User permissions test',async ()=>{
            
            let password = "test123" 
            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = new User({
                email:"test@example.com",
                name: "exampleUser1",
                password:hashedPassword,
                phoneNo:"123-425-729",
                role: ROLE.ADMIN
            });
            await newUser.save();

            let res = await request.post('/auth/login').send(
                {
                    email: "test@example.com",
                    password:"test123"
                }
            )
            .expect(200);
            expect(res.body.message).toBe("User validation success");
            expect(res.body.data.token).toBeDefined();
            expect(res.body.data.refreshToken).toBeDefined();
            expect(res.body.success).toBe(true);
            res = await request.get('/auth/admintest').set('Authorization', `Bearer ${res.body.data.token}`)
            .expect(200);
            expect(res.body).toEqual("Success");  
        });
    });
});