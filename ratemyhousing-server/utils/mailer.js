require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendMail(toEmail,content) {
    let mailAuth= {
        service: process.env.SERVICE,
        auth:{
            user: process.env.RMHMAIL,
            pass: process.env.PASS
        },
        secure: false,
        port: 587
    }
    let message = {
        from: process.env.RMHMAIL,
        to: toEmail,
        subject: content.subject,
        text: content.body,
        html: content.html
    }
    return new Promise((resolve,reject)=>{
        nodemailer.createTransport(mailAuth).sendMail(message).then((info)=>{
            resolve(info);
        },(err)=>{
            reject(err)
        });
    });
}


module.exports = {
    sendMail
};
  