const express = require('express')
const router = express.Router()
const User = require('../model/userModel')
const Mail = require('../utils/mail')

let codes = {}  //保存验证码在内存中

/**
 * @api {post} /user/reg 用户注册
 * @apiName 用户注册
 * @apiGroup User
 *
 * @apiParam {String} us 用户名.
 * @apiParam {String} ps 用户密码.
 * @apiParam {String} code 邮箱验证码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
//注册
router.post('/reg', (req, res) => {
    let { us, ps, code } = req.body
    console.log(codes[us])
    console.log(code)
    if (!us || !ps || !code) {
        return res.send({ err: -1, msg: '参数错误' })
    } else if (codes[us] != code) {
        return res.send({ err: -1, msg: '验证码错误' })
    } else if (us && ps && code) {
        User.find({ us })
            .then((data) => {
                if (data.length === 0) {
                    return User.insertMany({ us: us, ps: ps })
                } else {
                    res.send({ err: -3, msg: '用户名已存在' })
                }
            })
            .then(() => {
                res.send({ err: 0, msg: '注册ok' })
            })
            .catch((err) => {
                console.log(err)
                res.send({ err: -2, msg: '注册err' })
            })
    } else {
        return res.send({ err: -1, msg: '参数错误' })
    }

    console.log(us, ps)
})

/**
 * @api {post} /user/login 用户登录
 * @apiName login
 * @apiGroup User
 *
 * @apiParam {String} us 用户名.
 * @apiParam {String} ps 用户密码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
//登录
router.post('/login', (req, res) => {
    let { us, ps } = req.body
    if (!us || !ps) {
        return res.send({ err: -1, msg: '参数错误' })
    }
    User.find({ us: us, ps: ps })
        .then((data) => {
            if (data.length > 0) {
                // 登录成功后将用户的想换信息存到 session 中去
                req.session.login = true
                req.session.name = us
                req.session.headPortrait = data[0].img
                res.send({ err: 0, msg: '登录成功' })
            } else {
                res.send({ err: -2, msg: '用户名和密码不正确' })
            }
        })
        .catch((err) => {
            return res.send({ err: -1, msg: '内部错误' })
        })

})

/**
 * @api {post} /user/logout 用户退出
 * @apiName logout
 * @apiGroup User
 *
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/logout', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, (req, res) => {
    req.session.destroy()   // 销毁保存的 session
    res.send({err: 0, msg: '已退出'})
})

/**
 * @api {post} /user/getLoginUser 获取当前登录的用户的信息
 * @apiName getLoginUser
 * @apiGroup User
 *
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/getLoginUser', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, (req, res) => {
    let loginUser = req.session
    res.send({err: 0, msg: '查询成功', loginUser})
})

/**
 * @api {post} /user/getInfoByPage 分页查询
 * @apiName getInfoByPage
 * @apiGroup User
 *
 * @apiParam {Number} pageSize 每一页的数据条数.
 * @apiParam {Number} page 那一页.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByPage', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let pageSize = req.body.pageSize || 2   //如果用户不传参数默认值为2
    let page = req.body.page || 1   //如果用户不传参数默认值为1

    let count = 0
    User.find()
    .then((list)=>{
        count = list.length
        return User.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
    })
    .then((data)=>{
        let allpage = Math.ceil(count/pageSize)
        res.send({err:0,msg:'查询成功',info:{list:data,count,allpage}})
    })
    .catch(()=>{
        res.send({err:-1,msg:'查询失败'})
    })
})

/**
 * @api {post} /user/getInfoById 回显用户信息
 * @apiName getInfoById
 * @apiGroup User
 *
 * @apiParam {String} _id 用户id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoById', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let {_id} = req.body
    User.find({_id})
    .then((data) => {
        res.send({ err: 0, msg: '查询成功', list:data })
    })
    .catch(() => {
        res.send({ err: -1, msg: '查询失败' })
    })
})

/**
 * @api {post} /user/updata 更新用户信息
 * @apiName updata
 * @apiGroup User
 *
 * @apiParam {String} _id 菜品主键id.
 * @apiParam {String} name 用户名.
 * @apiParam {Number} sex 性别 男0 女1.
 * @apiParam {Number} tel 手机.
 * @apiParam {String} img 用户头像.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/updata', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, (req, res) => {
    let {name,img,_id,age,tel} = req.body
    //判断参数是否正确
    User.update({_id},{name,img,_id,age,tel})
        .then((data) => {
            res.send({ err: 0, msg: '修改成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '修改失败' })
        })
})

/**
 * @api {post} /user/updataPs 更新用户密码
 * @apiName updataPs
 * @apiGroup User
 *
 * @apiParam {String} _id 菜品主键id.
 * @apiParam {String} ps 密码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/updata', (req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, (req, res) => {
    let {_id,ps} = req.body
    //判断参数是否正确
    User.update({_id},{ps})
        .then((data) => {
            res.send({ err: 0, msg: '修改成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '修改失败' })
        })
})

/**
 * @api {post} /user/getInfoByKw 用户查询
 * @apiName getInfoByKw
 * @apiGroup User
 *
 * @apiParam {String} kw 关键字.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByKw',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let {kw} = req.body
    let reg = new RegExp(kw)
    // User.find({$or:[{name:{$regex:reg}},{tel:{$regex:reg}}]})    //查询名字 以及描述
    User.find({name})   
    .then((data)=>{
        res.send({err:0,msg:'查询ok',list:data})
    })
    .catch(()=>{
        res.send({err:-1,msg:'查询失败'})
    })
})

/**
 * @api {post} /user/getMailCode 发送邮箱验证码
 * @apiName 发送邮箱验证码
 * @apiGroup User
 *
 * @apiParam {String} mail 用户邮箱.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
//发送邮箱验证码
var time = 1
router.post('/getMailCode', (req, res) => {
    let { mail } = req.body
    // console.log(req.body)
    // if(!mail){
    //     req.send({err:-1,msg:'参数错误'})
    // }else{
    //产生一个随机验证码
    let code = parseInt(Math.random() * 1000000)
    Mail.send(mail, code)
        .then(() => {
            codes[mail] = code  //此时codes中包含这前端传过来的所有信息
            codes[cTime] = new Date()
            time = 0
					setTimeout(()=>{
						time = 1
					},60000)
            // console.log(codes)
            res.send({ err: 0, msg: '验证码发送 ok' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '验证码发送 no ok' })
        })
    // res.send('邮件')
    // }
})

module.exports = router