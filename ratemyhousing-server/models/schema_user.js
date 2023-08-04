const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ROLE} = require('../models/roles');

const validateEmail = (email) => {
    const re =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
 };

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        validate:validateEmail,
        unique:true
    },
    name:{
        type:String,
        required : true
    },
    password:{
        type:String,
        required:true,
    },
    phoneNo:{
        type:String,
    },
    tokens: {
        type: [String]
    },
    properties:{
        type: [String]
    },
    reviews: {
        type: [String]
    },  
    role:{
        type: String,
        required: true,
        default: ROLE.BASIC
    }
});

const User = mongoose.model('User', UserSchema) ;
module.exports = {
    User,
    UserSchema,
    validateEmail
}

