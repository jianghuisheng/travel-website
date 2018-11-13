const UserModel = require('../model/User.js');
const ShoppingCartModel = require('../model/ShoppingCart');
const CargoModel = require('../model/Cargo');
const OrderModel = require('../model/order');
const CollectModel = require('../model/Collect');
const CommentModel = require('../model/comment');

//引入格式化日期的moment模块
const moment = require('moment');
const session = require('express-session');

const order={
    adminOrderStatus:(req,res,next)=>{
       OrderModel.findOne({_id:req.body.orderId}).exec((err,order)=>{
           // console.log(order);
           if (err) {
               return res.json({
                   error: 1,
                   msg: '数据库错误'
               })
           }
           if (!order) {
               return res.json({
                   error: 1,
                   msg: '订单'
               })
           }
            if(order.status<2){
               order.status+=1;
               order.save();
               OrderModel.findOne({_id:req.body.orderId}).exec((err,order)=>{
                   if (err) {
                       return res.json({
                           error: 1,
                           msg: '数据库错误'
                       })
                   }
                   if (!order) {
                       return res.json({
                           error: 1,
                           msg: '订单'
                       })
                   }
                   return res.json({
                       error: 0,
                       msg: '订单进度+=1',
                       status:order.status
                   })
               })
            }else{
                return res.json({
                    error: 0,
                    msg: '等待客户签收',
                })
            }
       })
    },
    userOrderStatus:(req,res,next)=>{
        console.log(req.body);
        OrderModel.findOne({_id:req.body.orderId}).exec((err,order)=>{
            console.log(order);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!order) {
                return res.json({
                    error: 1,
                    msg: '订单'
                })
            }
            if(order.status>=2 &&order.status<4){
                order.status +=1;
                order.save();
                OrderModel.findOne({_id:req.body.orderId}).exec((err,order)=>{
                    if (err) {
                        return res.json({
                            error: 1,
                            msg: '数据库错误'
                        })
                    }
                    if (!order) {
                        return res.json({
                            error: 1,
                            msg: '订单'
                        })
                    }
                    return res.json({
                        error: 0,
                        msg: '订单进度+=1',
                        status:order.status
                    })
                })
            }else{
                return res.json({
                    error: 0,
                    msg: '等待发货',
                })
            }
        })
    },
    orderComment:(req,res,next)=>{
        OrderModel.findOne({_id:req.body.orderId}).exec((err,order)=>{
            console.log(order);
            // console.log(order);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!order) {
                return res.json({
                    error: 1,
                    msg: '订单'
                })
            }
            return res.json({
                error: 0,
                msg: '订单Ok',
                order
            })
        })
    },
    orderCommentAdd:(req,res,next)=>{
        // console.log(req.body);
        OrderModel.findOne({_id:req.body.orderId}).exec((err,order)=>{
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!order) {
                return res.json({
                    error: 1,
                    msg: '订单'
                })
            }
            let buyOrderId = order._id;
            let buyOrderUserId = order.buyShopUserId;
            let buyOrderAdmin = order.shopAdmin;
            let shopName = order.shopName;
            let shopImage = order.shopImage;
            let rate = req.body.values.rate;
            let buyShopId = order.buyShopId;
            let buyOrderUserName = req.body.username;
            let comment_text = req.body.values.comment_text;
            CommentModel.findOne({$and:[{buyOrderId:order._id },{buyOrderUserId:order.buyShopUserId}]}).exec((err,comment)=> {
                // console.log(comment);
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '数据库错误'
                    })
                }
                if (comment) {
                    return res.json({
                        error: 1,
                        msg: '已经评论过了'
                    })
                }
                let com = new CommentModel({
                    buyOrderId,
                    buyOrderUserId,
                    buyOrderAdmin,
                    shopName,
                    shopImage,
                    rate,
                    buyShopId,
                    comment_text,
                    buyOrderUserName
                });
                com.save((err)=>{
                    if (err) {
                        return res.json({
                            error: 1,
                            msg: '数据库错误'
                        })
                    }
                    order.status +=1;
                    order.save();
                    console.log(order);
                    return res.json({
                        error: 0,
                        msg: '评论发布成功'
                    })
                })

            });
        })
    },
    orderCommentShow:(req,res,next)=>{
        // console.log(req.body);
        CommentModel.find({buyShopId:req.body.shopId}).exec((err,comments)=>{
            // console.log(comments);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!comments) {
                return res.json({
                    error: 1,
                    msg: '评论'
                })
            }
            return res.json({
                error: 0,
                msg: '评论显示了',
                comments
            })
        })
    }
};

module.exports = order;