const config = require('config');
const mongoose = require('mongoose');
const { User } = require('../models/schema_user');
const { resetPassword, generateResetLink,findUserfromEmail, sendEmailToUser } = require('../controllers/user');
const dbUrl = config.get('db.dbUrl');
const bcrypt = require('bcrypt');
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const { generateAccessToken } = require('../controllers/auth');

jest.setTimeout(10000);
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const info = {
    accepted: ["test@example.com"],
    rejected:[]
}

describe('Account Recovery tests',()=>{
    beforeAll(async ()=>{
        await User.deleteMany({});
      });

    afterEach(async ()=>{
        await User.deleteMany({});
    });

    afterAll(async ()=>{
      await mongoose.connection.close();
    });

    it('Mail Generation Integration - it should send an invalid user error',async ()=>{
        let res = await request.post('/user/forgotPassword').send({
            email: "test@email.com"
        }).expect(404);
        expect(res.body.message).toBe("No such user found");
    });

    it('Mail Generation Integration - Sending email to user',async ()=>{
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email: process.env.RMHMAIL,
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729"
        });
        await newUser.save({validateBeforeSave : false});
        let res = await request.post('/user/forgotPassword').send({
            email: newUser.email
        }).expect(200);
        expect(res.body.message).toBe("Mail sent successfully!");
    });

    it('Mail Generation Link Generator- it should throw an error as user doesnt exist',async ()=>{
        const email = "random@email.com";
        await expect(findUserfromEmail(email)).rejects.toThrow('No such user found');    
    });

    it('Reset Password - it should throw error as token is invalid',async ()=>{
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729"
        });
        await newUser.save();

        const accessToken = generateAccessToken({email:newUser.email});

        let res = await request.post('/user/resetPassword')
        .set('Authorization', `Bearer ${accessToken}1`).send({
            email: newUser.email
        }).expect(403);
        expect(res.body.message).toBe("invalid signature");
    });

    it('Reset Password - it should allow to reset the password for the user',async ()=>{
        let password = "test123" 
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            email:"test@example.com",
            name: "exampleUser1",
            password:hashedPassword,
            phoneNo:"123-425-729"
        });
        await newUser.save();

        const accessToken = generateAccessToken({email:newUser.email});

        let res = await request.post('/user/resetPassword')
        .set('Authorization', `Bearer ${accessToken}`).send({
            newPass: "test123"
        }).expect(200);
        expect(res.body.message).toBe("Password reset successfully");
        expect(res.body.data).toBe(newUser.email);
    });


});