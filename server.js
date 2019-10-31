const express = require('express')
const db = require('./db/connect')
const cookieParse = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const app = new express()
// const Mail = require('../utils/mail')
// console.log(Mail)

const bodypaser = require('body-parser')
// //app.use 使用中间件（插件）
// //解析表单数据 x-www-form-urlencoded
app.use(bodypaser.urlencoded({ extended: false }))
// //解析json数据
app.use(bodypaser.json())

// session 的整体配置
app.use(session({
    secret: 'Odasbhn41854asdqw',     //秘钥
    resave: true,   // 即使 session 没有修改也保存 session 值
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 *60 }   //回话保存时间 一小时
}))



//路由
const userRouter = require('./router/userRouter')
const foodRouter = require('./router/foodRouter')
const fileRouter = require('./router/fileRouter')
const orderRouter = require('./router/orderRouter')


//获取静态图片，为静态图片地址做拼接
app.use('/public', express.static(path.join(__dirname, './static')))


app.use('/user', userRouter)

app.use('/food', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, foodRouter)

app.use('/file', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, fileRouter)

app.use('/order', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, orderRouter)



app.listen('3000', () => {
    console.log('server start');
})
