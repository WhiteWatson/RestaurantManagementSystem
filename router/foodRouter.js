const express = require('express')
const router = express.Router()
const foodMoudel = require('../model/foodModel')


/**
 * @api {post} /food/add 添加菜品
 * @apiName addfood
 * @apiGroup food
 *
 * @apiParam {String} name 菜品名称.
 * @apiParam {String} price 菜品价格.
 * @apiParam {String} desc 菜品描述.
 * @apiParam {String} typename 菜品类型.
 * @apiParam {Number} typeid 菜品类型id.
 * @apiParam {String} img 菜品图片.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/add',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, (req, res) => {
    let {name,price,desc,typename,typeid,img} = req.body
    //判断参数是否正确
    foodMoudel.insertMany({name,price,desc,typename,typeid,img})
        .then((data) => {
            res.send({ err: 0, msg: '添加成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '添加失败' })
        })
})

/**
 * @api {post} /food/updata 更新菜品信息
 * @apiName updata
 * @apiGroup food
 *
 * @apiParam {String} _id 菜品主键id.
 * @apiParam {String} name 菜品名称.
 * @apiParam {String} price 菜品价格.
 * @apiParam {String} desc 菜品描述.
 * @apiParam {String} typename 菜品类型.
 * @apiParam {Number} typeid 菜品类型id.
 * @apiParam {String} img 菜品图片.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/updata',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
}, (req, res) => {
    let {name,price,desc,typename,typeid,img,_id} = req.body
    //判断参数是否正确
    foodMoudel.update({_id},{name,price,desc,typename,typeid,img})
        .then((data) => {
            res.send({ err: 0, msg: '修改成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '修改失败' })
        })
})

/**
 * @api {post} /food/getInfoById 回显菜品信息
 * @apiName getInfoById
 * @apiGroup food
 *
 * @apiParam {String} _id 菜品id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoById',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let {_id} = req.body
    foodMoudel.find({_id})
    .then((data) => {
        res.send({ err: 0, msg: '查询成功', list:data })
    })
    .catch(() => {
        res.send({ err: -1, msg: '查询失败' })
    })
})

/**
 * @api {post} /food/getInfoByType 查询菜品
 * @apiName getInfoByType
 * @apiGroup food
 *
 * @apiParam {Number} typeid 菜品类型id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByType',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let {typeid} = req.body
    foodMoudel.find({typeid})
    .then((data) => {
        res.send({ err: 0, msg: '查询成功', list:data })
    })
    .catch(() => {
        res.send({ err: -1, msg: '查询失败' })
    })
})

/**
 * @api {post} /food/getInfoByKw 关键字查询
 * @apiName getInfoByKw
 * @apiGroup food
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
    foodMoudel.find({$or:[{name:{$regex:reg}},{desc:{$regex:reg}}]})    //查询名字 以及描述
    .then((data)=>{
        res.send({err:0,msg:'查询ok',list:data})
    })
    .catch(()=>{
        res.send({err:-1,msg:'查询失败'})
    })
})

/**
 * @api {post} /food/del 单个删除
 * @apiName del
 * @apiGroup food
 *
 * @apiParam {String} _id 主键.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/del',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let {_id} = req.body
    foodMoudel.remove({_id})
    .then((data)=>{
        res.send({err:0,msg:'删除成功'})
    })
    .catch(()=>{
        res.send({err:-1,msg:'删除失败'})
    })
})

/**
 * @api {post} /food/dels 多个删除
 * @apiName dels
 * @apiGroup food
 *
 * @apiParam {String} _id 主键.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/dels',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let {_id} = req.body
    foodMoudel.remove({_id})
    .then((data)=>{
        res.send({err:0,msg:'删除成功'})
    })
    .catch(()=>{
        res.send({err:-1,msg:'删除失败'})
    })
})

/**
 * @api {post} /food/getInfoByPage 分页查询
 * @apiName getInfoByPage
 * @apiGroup food
 *
 * @apiParam {Number} pageSize 每一页的数据条数.
 * @apiParam {Number} page 那一页.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByPage',(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req,res)=>{
    let pageSize = req.body.pageSize || 2   //如果用户不传参数默认值为5
    let page = req.body.page || 1   //如果用户不传参数默认值为1

    let count = 0
    foodMoudel.find()
    .then((list)=>{
        count = list.length
        return foodMoudel.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
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
 * @api {get} /food/getInfoByName 订单查询(柱状图)
 * @apiName getInfoByName
 * @apiGroup food
 *
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/getInfoByName', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    foodMoudel.find({})    //查询名字 以及描述
        .then((data) => {
            res.send({ err: 0, msg: '查询ok', list: data })
        })
        .catch(() => {
            res.send({ err: -1, msg: '查询失败' })
        })
})


module.exports = router