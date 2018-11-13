
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/travels',{useNewUrlParser:true});
const db = mongoose.connection;
db.once('open',(err)=> {
    if (err){
        console.log('数据库连接失败');
    } else{
        console.log('数据库连接成功');
    }
});
module.exports = db;