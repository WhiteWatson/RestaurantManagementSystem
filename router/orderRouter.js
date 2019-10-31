const express = require('express')
const router = express.Router()
const orderModel = require('../model/orderModel')
const foodMoudel = require('../model/foodModel')
const User = require('../model/userModel')



/**
 * @api {post} /order/add 添加订单
 * @apiName addOrder
 * @apiGroup Order
 *
 * @apiParam {String} food 选购菜品.
 * @apiParam {Number} receivables 付款.
 * @apiParam {String} drawee 付款会员（手机号码）.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/add', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    let { food, receivables, drawee } = req.body
    foodMoudel.find({ name: food })    //查询名字 以及描述
        .then((data) => {
            if (data.length == 0) {
                res.send({ err: -2, msg: '查无菜品' })
            } else if (drawee == '') {
                return orderModel.insertMany({ food, receivables, drawee })
                    .then((data) => {
                        res.send({ err: 0, msg: '添加成功' })
                    })
            } else if (drawee != '') {
                return User.find({ tel: drawee })
                    .then((data) => {
                        let jifen = data[0].integral
                        if (data.length != 0) {
                            return orderModel.insertMany({ food, receivables, drawee })
                                .then((data) => {
                                    return User.updateOne({ tel: drawee }, { integral: parseInt(receivables) + parseInt(jifen) })
                                        .then(() => {
                                            res.send({ err: 0, msg: '添加成功' })
                                        })
                                })
                        } else {
                            res.send({ err: -3, msg: '未查询到该会员' })
                        }
                    })
            }
        })
        .catch((err) => {
            console.log(err)
            res.send({ err: -1, msg: '添加失败' })
        })
})

/**
 * @api {post} /order/del 单个删除
 * @apiName del
 * @apiGroup Order
 *
 * @apiParam {String} _id 主键.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/del', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    let { _id } = req.body
    orderModel.remove({ _id })
        .then((data) => {
            res.send({ err: 0, msg: '删除成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '删除失败' })
        })
})

/**
 * @api {post} /order/getInfoByPage 分页查询
 * @apiName getInfoByPage
 * @apiGroup Order
 *
 * @apiParam {Number} pageSize 每一页的数据条数.
 * @apiParam {Number} page 那一页.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByPage', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    let pageSize = req.body.pageSize || 2   //如果用户不传参数默认值为2
    let page = req.body.page || 1   //如果用户不传参数默认值为1

    let count = 0
    orderModel.find()
        .then((list) => {
            count = list.length
            return orderModel.find().limit(Number(pageSize)).skip(Number((page - 1) * pageSize))
        })
        .then((data) => {
            let allpage = Math.ceil(count / pageSize)
            res.send({ err: 0, msg: '查询成功', info: { list: data, count, allpage } })
        })
        .catch(() => {
            res.send({ err: -1, msg: '查询失败' })
        })
})

/**
 * @api {post} /order/getInfoById 回显订单信息
 * @apiName getInfoById
 * @apiGroup Order
 *
 * @apiParam {String} _id 订单id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoById', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    let { _id } = req.body
    orderModel.find({ _id })
        .then((data) => {
            res.send({ err: 0, msg: '查询成功', list: data })
        })
        .catch(() => {
            res.send({ err: -1, msg: '查询失败' })
        })
})

/**
 * @api {post} /order/updata 更新订单信息
 * @apiName updata
 * @apiGroup Order
 *
 * @apiParam {String} _id 订单主键id.
 * @apiParam {String} food 选购菜品.
 * @apiParam {Number} receivables 付款.
 * @apiParam {String} drawee 付款会员（手机号码）.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/updata', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    let { food, receivables, drawee, _id } = req.body
    //判断参数是否正确
    orderModel.update({ _id }, { food, receivables, drawee, _id })
        .then((data) => {
            res.send({ err: 0, msg: '修改成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '修改失败' })
        })
})

/**
 * @api {post} /order/getInfoByKw 关键字查询
 * @apiName getInfoByKw
 * @apiGroup Order
 *
 * @apiParam {String} kw 关键字.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByKw', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    let { kw } = req.body
    let reg = new RegExp(kw)
    // console.log(kw)
    // orderModel.find({ drawee: kw })    //查询名字 以及描述
    orderModel.find({"createTime" : {$gte:new Date(2019,10,31)}})
        // orderModel.find({ createTime: kw })
        .then((data) => {
            res.send({ err: 0, msg: '查询ok', list: data })
        })
        .catch(() => {
            res.send({ err: -1, msg: '查询失败' })
        })
})

/**
 * @api {post} /order/getInfoByName 订单查询(柱状图)
 * @apiName getInfoByName
 * @apiGroup Order
 *
 * @apiParam {String} food 菜名.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoByName', (req, res, next) => {
    if (req.session.login) {
        next()
    } else {
        res.send({ err: -999, msg: '请先登录' })
    }
}, (req, res) => {
    let { food } = req.body
    orderModel.find({ food })    //查询名字 以及描述
        .then((data) => {
            res.send({ err: 0, msg: '查询ok', list: data })
        })
        .catch(() => {
            res.send({ err: -1, msg: '查询失败' })
        })
})


module.exports = router