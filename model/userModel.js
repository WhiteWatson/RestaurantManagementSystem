const mongoose = require('mongoose');
// 创建一个和集合相关的 scheme 对象
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String },
    us: { type: String, required: true },
    ps: { type: String, required: true },
    sex: { type: Number, default: 0 },
    age: { type: Number, default: 0 },
    tel: { type: Number, default: 0 },
    integral: { type: Number, default: 0 },
    img: { type: String },
});
// 将 scheme 对象转化为数据模型
var User = mongoose.model('user', userSchema);  //该数据对象和集合相关联

module.exports = User