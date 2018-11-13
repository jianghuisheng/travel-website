const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    //购买的商品的id
    buyCargo:{
        type:mongoose.Schema.ObjectId,
        ref:'Cargo'
    },
    //客户的id
    buyUser:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    //商品的管理员id
    buyAdmin:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    buyNum:{
        type:Number,
        default:0
    },
    shopName:String,
    shopImage:String,
    shopDescription:String,
    shopPrice:Number,
    create_time:String,
    update_time:String
});
CartSchema.statics={
    //用户名
    getCartByUserId:(buyUser,callback)=>{
        ShoppingCartModel.findOne({buyUser}).then((cart)=>{
            // console.log(user);
            callback(null,cart)
        }).catch((err)=>{
            console.log(err);
            callback(err);
        })
    },
};

const ShoppingCartModel = mongoose.model('ShoppingCart', CartSchema);
module.exports = ShoppingCartModel;