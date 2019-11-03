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
    cookie: { maxAge: 60 * 1000 * 60 * 24 }   //回话保存时间 一小时
}))



//路由
const userRouter = require('./router/userRouter')
const foodRouter = require('./router/foodRouter')
const fileRouter = require('./router/fileRouter')
const orderRouter = require('./router/orderRouter')


//获取静态图片，为静态图片地址做拼接
app.use('/public', express.static(path.join(__dirname, './static')))


app.use('/user', userRouter)

app.use('/food', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, foodRouter)

app.use('/file', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, fileRouter)

app.use('/order', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, orderRouter)

app.use(function (req, res) {
    // res.send('my 404')
    res.send("<img width=1500 src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573218087&di=f990cc9b11c4a14f0fd2a4854561cc2e&imgtype=jpg&er=1&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fe291fd0620edbd70d10302e5627b9e1fa5edb7963c31b-gOdPdM_fw658' />")
})


app.listen('3000', () => {
    console.log('server start');
})


//-----------------------------------------------------------------
// var http = require("http");
// var fs = require("fs");
// var ws = require("socket.io");


// var server = http.createServer(function (req, res) {//创建并返回一个web服务器实例
//     var html = fs.readFileSync("./static/html/feedback-list.html");
//     res.writeHead(200, {"Content-Type": "text/html"});
//     res.end(html);

// });

// server.listen("8080");//监听端口    端口号必须是字符串类型

// var io = ws(server);

// var person = 0;

// io.on("connection", function (socket) {
//     person++;
//     console.log("有新用户连接聊天室，当前聊天室人数为  " + person);

//     socket.on("message", function (mes) {
//         io.emit("message", mes);
//         console.log(mes);
//     });

//     socket.on("disconnect", function () {
//         person--;
//         console.log("有用户退出聊天室，当前聊天室人数为  " + person);
//     })

// });



