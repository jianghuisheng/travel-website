
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    admin:Boolean,
    headPhoto:String,
    address:Array,
    birthDay:String,
    phoneNumber:Number,
    sex:Boolean,
    signature:String,
    collect:{
        type:Number,
        default:0
    },
    create_time:String,
    update_time:String,
    cart_goods_num:{
        type:Number,
        default:0
    },
    money:Number,
    //订单数量
    order_num:{
        type:Number,
        default:0
    },
    order:Array,
    return_order_num:{
        type:Number,
        default:0
    },
    return_order:Array,
    comment:String,
    comment_num:{
        type:Number,
        default:0
    },
    addCargoCount:{
        type:Number,
        default:0
    }
});
UserSchema.statics={
    //用户名
    getUserByName:(username,callback)=>{
        UserModel.findOne({username}).then((user)=>{
            // console.log(user);
            callback(null,user)
        }).catch((err)=>{
            console.log(err);
            callback(err);
        })
    },
    //email
    getUserByEmail:(email,callback)=>{
        UserModel.findOne({email}).then((user)=>{
            // console.log(email);
            callback(null,user)
        }).catch((err)=>{
            console.log(err);
            callback(err);
        })
    },
    //admin
    getUserByAdmin:(admin,callback)=>{
        UserModel.count({admin:true}).then((count)=>{
            // console.log(count);
            callback(null,count)
        }).catch((err)=>{
            console.log(err);
            callback(err);
        })
    },
};

const UserModel = mongoose.model('User',UserSchema);
module.exports = UserModel;