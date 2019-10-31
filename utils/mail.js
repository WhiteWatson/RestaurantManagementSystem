'use strict';
const nodemailer = require('nodemailer');

//创建发送邮件的请求对象
let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',    //发送端邮箱类型（QQ邮箱）
    port: 465,      //端口号
    secure: true, // true for 465, false for other ports
    auth: {
        user: '734004037@qq.com', // 发送方的邮箱地址（自己的）
        pass: 'fzmojdrnxubwbfhc' // mtp 验证码
    }
});


function send(mail, code) {
    let mailObj = {
        from: '"今天天气不错" <734004037@qq.com>', // sender address
        to: mail, // list of receivers
        subject: '1902', // Subject line
        text: '您的验证码是'+ code +'，有效期五分钟', // plain text body
        // html: '<b>Hello world?</b>' // html body
    }
    // 发送邮件(封装成一个promise对象)
    return new Promise((resolve, reject)=>{
        transporter.sendMail(mailObj, (err, data) => {
            // console.log(err);
            // console.log(data);
            if(err){
                reject()    //出错
            }else{
                resolve()
            }
        })
    })
    
}

//抛出一个对象
module.exports = { send }
