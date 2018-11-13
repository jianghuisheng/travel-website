const UserModel = require('../model/User.js');
const ShoppingCartModel = require('../model/ShoppingCart');
const CargoModel = require('../model/Cargo');
const OrderModel = require('../model/order');
const CollectModel = require('../model/Collect');
//引入格式化日期的moment模块
const moment = require('moment');
const session = require('express-session');


const Cart = {
    // 显示在购物车中
    showCart: (req, res, next) => {
        let userId = req.session.user._id;
        // console.log(userId);
        ShoppingCartModel.find({buyUser: userId}).populate('buyCargo').exec((err, cart) => {
            // console.log(cart);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!cart) {
                return res.json({
                    error: 1,
                    msg: '商品不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '购物车中的商品找到了',
                cart
            })
        })
    },
//删除购物车中的商品，用户的购物车中的数量减一
    deleteCartCargo: (req, res, next) => {
        // console.log(req.body.shopId);
        ShoppingCartModel.findOne({_id: req.body.shopId}).exec((err, cart) => {
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!cart) {
                return res.json({
                    error: 1,
                    msg: '商品不存在或以删除'
                })
            }
            ShoppingCartModel.deleteOne({_id: req.body.shopId}).exec((err, cart) => {
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '数据库错误'
                    })
                }
                if (!cart) {
                    return res.json({
                        error: 1,
                        msg: '商品不存在或以删除'
                    })
                }
                UserModel.getUserByName(req.body.username, (err, user) => {
                    if (err) {
                        return res.json({
                            error: 1,
                            msg: '数据库错误'
                        })
                    }
                    if (!user) {
                        return res.json({
                            error: 1,
                            msg: '用户不存在'
                        })
                    }
                    user.cart_goods_num -= 1;
                    user.save();
                    return res.json({
                        error: 0,
                        msg: '购物车中商品删除成功'
                    })
                })
            })
        })
    },
//    结算成功，清除商品，并创建订单集合，购物车中商品数量减一， order_num
//，商品的剩余量减一 cargo_remain，出售量加一cargo_sales
    addOrder: (req, res, next) => {
        console.log(req.body);
        let shopId = req.body.shopId;
        for (let i = 0; i < shopId.length; i++) {
            //查找商品，找到商品，
            ShoppingCartModel.findOne({_id: shopId[i]}).exec((err, cart) => {
                // console.log(cart);
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '数据库错误'
                    })
                }
                if (!cart) {
                    return res.json({
                        error: 1,
                        msg: '商品不存在或以删除'
                    })
                }
                let buyShopId = cart.buyCargo;
                let shopAdmin = cart.buyAdmin;
                let buyShopUserId = cart.buyUser;
                let shopName = cart.shopName;
                let shopImage = cart.shopImage;
                let status = 0;
                let date = new Date();
                let create_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
                let update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
                OrderModel.findOne({$and: [{buyShop: cart._id}, {buyShopUserId: cart.buyUser}]}).exec((err, order) => {
                    if (err) {
                        return res.json({
                            error: 1,
                            msg: '数据库错误1'
                        })
                    }
                    if (order) {
                        return res.json({
                            error: 1,
                            msg: '订单已存在'
                        })
                    }
                    let Order = new OrderModel({
                        buyShopId,
                        buyShopUserId,
                        shopAdmin,
                        status,
                        create_time,
                        update_time,
                        shopImage,
                        shopName
                    });
                    Order.save((err) => {
                        if (err) {
                            return res.json({
                                error: 1,
                                msg: '数据库错误2'
                            })
                        }
                        ShoppingCartModel.deleteOne({_id:shopId[i]}).exec((err, cart) => {
                            if (err) {
                                return res.json({
                                    error: 1,
                                    msg: '数据库错误3'
                                })
                            }
                            if (!cart) {
                                return res.json({
                                    error: 1,
                                    msg: '购物车不存在或以删除1'
                                })
                            }
                            CargoModel.findOne({_id: buyShopId}).exec((err, cargo) => {
                                // console.log(cargo);
                                if (err) {
                                    return res.json({
                                        error: 1,
                                        msg: '数据库错误4'
                                    })
                                }
                                if (!cargo) {
                                    return res.json({
                                        error: 1,
                                        msg: '商品不存在或以删除2'
                                    })
                                }
                                UserModel.getUserByName(req.body.username, (err, user) => {
                                    if (err) {
                                        return res.json({
                                            error: 1,
                                            msg: '数据库错误5'
                                        })
                                    }
                                    if (!user) {
                                        return res.json({
                                            error: 1,
                                            msg: '用户不存在'
                                        })
                                    }
                                    cargo.cargo_remain -= 1;
                                    cargo.cargo_sales += 1;
                                    cargo.save();
                                    user.order_num += 1;
                                    user.cart_goods_num -= 1;
                                    user.save();
                                    return res.json({
                                        error: 0,
                                        msg: '订单保存成功'
                                    })
                                })
                            })
                        })
                    });
                })
            })
        }
    },
//    订单显示页面
    userOrderShow: (req, res, next) => {
        OrderModel.find().exec((err, orders) => {
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!orders) {
                return res.json({
                    error: 1,
                    msg: '订单不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '找到订单了',
                orders
            })
        })
    },
//   管理员订单显示页面
    adminOrderShow: (req, res, next) => {
        let adminId = req.session.user._id;
        OrderModel.find({shopAdmin: adminId}).exec((err, orders) => {
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!orders) {
                return res.json({
                    error: 1,
                    msg: '订单不存在,或者客户还没结算'
                })
            }
            return res.json({
                error: 0,
                msg: '找到订单了',
                orders
            })
        })
    },
//   显示客户收藏的商品
    userCollectShow: (req, res, next) => {
        let userId = req.session.user._id;
        CollectModel.find({CollectUser: userId}).exec((err, collects) => {
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!collects) {
                return res.json({
                    error: 1,
                    msg: '收藏不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '找到订单了',
                collects
            })
        })
    },
//    取消收藏
    userCollectDelete: (req, res, next) => {
        CollectModel.findOne({_id: req.body.CollectId}).exec((err, collect) => {
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据库错误'
                })
            }
            if (!collect) {
                return res.json({
                    error: 1,
                    msg: '收藏不存在'
                })
            }
            CargoModel.findOne({_id: collect.CollectCargo}).exec((err, cargo) => {
                // console.log(cargo);
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '数据库错误'
                    })
                }
                if (!cargo) {
                    return res.json({
                        error: 1,
                        msg: '商品不存在'
                    })
                }
                CollectModel.deleteOne({_id: req.body.CollectId}).exec((err, collect) => {
                    // console.log(collect);
                    if (err) {
                        return res.json({
                            error: 1,
                            msg: '数据库错误'
                        })
                    }
                    if (!collect) {
                        return res.json({
                            error: 1,
                            msg: '收藏不存在'
                        })
                    }
                    UserModel.getUserByName(req.body.username, (err, user) => {
                        if (err) {
                            return res.json({
                                error: 1,
                                msg: '数据库错误'
                            })
                        }
                        if (!user) {
                            return res.json({
                                error: 1,
                                msg: '用户不存在'
                            })
                        }
                        cargo.cargo_collected -= 1;
                        cargo.save();
                        user.collect -= 1;
                        user.save();
                        return res.json({
                            error: 0,
                            msg: '取消收藏成功'
                        })
                    });
                })
            })
        })
    }
};
module.exports = Cart;