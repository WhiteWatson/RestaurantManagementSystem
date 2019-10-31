const mongoose = require('mongoose');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    food: { type: String, required: true },
    receivables: { type: Number, required: true },
    drawee: { type: String },
    createTime: {
        type: Date,
        default: Date.now
    },
});
// 将 scheme 对象转化为数据模型
var Order = mongoose.model('Orders', orderSchema);  //该数据对象和集合相关联

module.exports = Order