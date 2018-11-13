const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    //所购买的商品的id
    buyShopId:{
        type:mongoose.Schema.ObjectId,
        ref:'Cargo'
    },
    //管理员的id
    shopAdmin:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    //用户的id
    buyShopUserId:{
        type:mongoose.Schema.ObjectId,
        ref:'Cargo'
    },
    //商品的名称
    shopName:String,
    //商品的图片
    shopImage:String,
    // 商品状态
    status:Number
});

const OrderModel = mongoose.model('Order',OrderSchema);
module.exports = OrderModel;