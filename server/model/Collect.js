const mongoose = require('mongoose');
const CollectSchema = new mongoose.Schema({
    //收藏商品的id
    CollectCargo:{
        type:mongoose.Schema.ObjectId,
        ref:'Cargo'
    },
    //收藏客户的id
    CollectUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    CollectImage:String,
    CollectName:String,
    create_time:String,
    update_time:String
});
CollectSchema.statics={
    // 通过收藏用户的id查找
        getCargoByCollectUser:(CollectUser,callback)=>{
        CollectModel.findOne({CollectUser}).then((collect)=>{
            // console.log(user);
            callback(null,collect)
        }).catch((err)=>{
            console.log(err);
            callback(err);
        })
    },
};

const CollectModel = mongoose.model('Collect', CollectSchema);
module.exports =CollectModel;