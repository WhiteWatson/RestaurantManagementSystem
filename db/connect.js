//连接数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://47.97.215.3/RestaurantManagementSystem', { useUnifiedTopology: true , useNewUrlParser: true });
// mongoose.connect('mongodb://localhost/text', { useUnifiedTopology: true , useNewUrlParser: true });
//连接数据库
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db ok');
})