const express = require('express')
const router = express.Router()
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 指定文件路径
        cb(null, './static/image')
    },
    filename: function (req, file, cb) {
        // 指定文件名
        var fileFormat = (file.originalname).split('.')
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
})

var upload = multer({ storage: storage })

/**
 * @api {post} /file/upload 上传图片（返回图片的服务器地址）
 * @apiName upload
 * @apiGroup file
 *
 * @apiParam {file} name 菜品名称.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/upload', upload.single('foodImg'),(req,res,next)=>{
    if(req.session.login){
        next()
    }else{
        res.send({err: -999,msg: '请先登录'})
    }
},(req, res) => {
    let {size,mimetype,path,filename} = req.file
    let types = ['jpg','jpeg','png','gif']  //允许上传的数据类型
    let tmpType = mimetype.split('/')[1]
    if(size > 10000000){
        return res.send({err: -1, msg: '尺寸过大,上传图片最大为10MB'})
    }else if(types.indexOf(tmpType) == -1){
        return res.send({err: -2, msg:'媒体类型错误'})
    }else{
        let url = `/public/image/${filename}`
        res.send({err: 0, msg: '上传成功！', img: url})
    }
})



module.exports = router