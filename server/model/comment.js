const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    //所购买的订单的id
    buyOrderId:{
        type:mongoose.Schema.ObjectId,
        ref:'Order'
    },
    //管理员的id
    buyOrderAdmin:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    //用户的id
    buyOrderUserId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    //用户的id
    buyShopId:{
        type:mongoose.Schema.ObjectId,
        ref:'Cargo'
    },
    //商品的名称
    shopName:String,
    //商品的图片
    shopImage:String,
    //评级
    rate:Number,
//   用户名称
    buyOrderUserName:String,
//    文字描述
    comment_text:String
});

const CommentModel = mongoose.model('Comment',CommentSchema);
module.exports =CommentModel;