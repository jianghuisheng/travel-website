const CargoModel = require('../model/Cargo.js');
//引入格式化日期的moment模块
const moment = require('moment');
const UserModel = require('../model/User.js');
const ShoppingCartModel = require('../model/ShoppingCart');
const CollectModel = require('../model/Collect');
const cargoHandle ={
    //添加商品
    addCargo:(req,res,next)=>{
        // console.log(req.query);
        let username= req.session.user.username;
        let cargo_name = req.query.cargo_name;
        let cargo_image = req.query.cargo_image;
        let cargo_photos =[req.query.cargo_photo1,req.query.cargo_photo2,req.query.cargo_photo3,req.query.cargo_photo4,
            req.query.cargo_photo5,req.query.cargo_photo6];
        let description = req.query.description;
        let tags= [req.query.tag1,req.query.tag2,req.query.tag3,req.query.tag4];
        let cargo_actives = [req.query.cargo_active1,req.query.cargo_active2,req.query.cargo_active3,
            req.query.cargo_active4,req.query.cargo_active5];
        let cargo_price = req.query.cargo_price;
        let cargoAllNum = req.query.cargoAllNum;
        let before_price = req.query.before_price;
        let delivery_fee = req.query.delivery_fee;
        let delivery = req.query.delivery;
        let success_fee = req.query.success_fee;
        let cargo_remain = req.query.cargoAllNum;
        let type = req.query.type;
        let start_city = req.query.start_city;
        let start_time = req.query.start_time;
        //添加商品的管理员的id值
        let addUser = req.session.user._id;
        //格式化日期
        let date = new Date();
        let create_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
        let update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
        CargoModel.getCargoByCargoName(cargo_name,(err,cargo)=>{
            // console.log(cargo);
            //null
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
           if(cargo) {
                return res.json({
                    error: 1,
                    msg: '商品已上架，请重新输入'
                })
            }
            let Cargo = new CargoModel({
                cargo_name,
                cargo_image,
                description,
                tags,
                cargo_actives,
                cargo_price,
                cargoAllNum,
                before_price,
                delivery_fee,
                delivery,
                success_fee,
                create_time,
                update_time,
                cargo_remain,
                type,
                cargo_photos,
                start_city,
                start_time,
                addUser
            });
            Cargo.save((err) => {
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '商品数据库错误'
                    })
                }
               UserModel.getUserByName(username,(err,user)=>{
                    if(err){
                        return res.json({
                            error: 1,
                            msg: '数据库错误'
                        })
                    }
                    user.addCargoCount += 1;
                    user.save();
                    return res.json({
                        error: 0,
                        msg: '商品添加成功'
                    })
                })

           })
        })
    },
    //查找到所有商品
    findAllCargo:(req,res,next)=>{
        CargoModel.getAllCargo((err,cargos)=>{
           if(err){
               return res.json({
                   error: 1,
                   msg: '商品数据库错误'
               })
           }
            return res.json({
                error: 0,
                msg: '查找到了商品',
                cargos
            })
        })
    },
    // 商品详情页
    getCargoInfo:(req,res,next)=>{
        // console.log(req.query.id);
        CargoModel.getCargoByCargoName((req.query.name),(err,cargo)=>{
            // console.log(cargo);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!cargo) {
                return res.json({
                    error: 1,
                    msg: '商品不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '找到商品了',
                cargo
            })
        })
    },
    //   商品收藏
    cargoCollected:(req,res,next)=>{
        // console.log(req.query);
        let username = req.session.username;
        let buyId = req.session.user._id;
        //通过商品id查找商品
        CargoModel.findOne({_id:req.query.cargo_id}).populate('addUser','username').exec((err,cargo)=>{
        // CargoModel.getCargoByCargoId(req.query.cargo_id,(err,cargo)=>{
        //     console.log(cargo);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
             }
                if(!cargo) {
                    return res.json({
                        error: 1,
                        msg: '商品不存在'
                    })
                }
                    //商品的id和买东西的人一致 ，提示不可重复
                    CollectModel.findOne({$and: [{CollectCargo:cargo._id},{CollectUser:buyId}]}).exec((err, collect) => {
                        if (err) {
                            return res.json({
                                error: 1,
                                msg: '数据库错误'
                            })
                        }
                        if (collect) {
                            return res.json({
                                error: 1,
                                msg: '已收藏，不可重复收藏'
                            })
                        }
                        let shoucang = new CollectModel(req.body);
                        //格式化日期
                        let date = new Date();
                        shoucang.create_time =  moment(date).format('YYYY-MM-DD HH:mm:ss');
                        shoucang.update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
                        shoucang.CollectCargo = cargo._id;
                        shoucang.CollectUser = req.session.user._id;
                        shoucang.CollectName = cargo.cargo_name;
                        shoucang.CollectImage = cargo.cargo_image;
                        shoucang.save((err)=> {
                            if (err) {
                                return res.json({
                                    error: 1,
                                    msg: '商品数据库错误'
                                })
                            }
                        UserModel.getUserByName(username, (err, user) => {
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
                            cargo.cargo_collected += 1;
                            cargo.save();
                            user.collect += 1;
                            user.save();
                            return res.json({
                                error: 0,
                                msg: '收藏成功了',
                                collect: true
                            })
                        })
                    })
                })
        })
    },
//   商品购买添加至购物车
    cargoBuy:(req,res,next)=>{
        // console.log(req.query);
        let cargo_id= req.query.id;
        let username= req.session.user.username;
        let user_id= req.session.user._id;
        //点击查找相应的商品
        CargoModel.getCargoByCargoId({_id:cargo_id},(err,cargo)=>{
            // console.log(cargo);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!cargo) {
                return res.json({
                    error: 1,
                    msg: '商品不存在'
                })
            }
            let shopName = cargo.cargo_name;
            let shopImage = cargo.cargo_image;
            let shopDescription= cargo.description;
            let shopPrice = cargo.cargo_price;
            let shopDelivery_fee = cargo.delivery_fee;
            let buyAdmin = cargo.addUser;
            ShoppingCartModel.findOne({$and:[{buyCargo:cargo_id },{buyUser:user_id}]}).exec((err,cargo)=>{
                // console.log(cargo);
                if(err){
                     return res.json({
                          error:1,
                          msg:'数据库错误'
                     })
                    }
                    if(cargo){
                        return res.json({
                            error:1,
                            msg:'已添加，不可重复购买'
                        })
                    }
                    let cart = new ShoppingCartModel(req.body);
                    //格式化日期
                    let date = new Date();
                    cart.create_time =  moment(date).format('YYYY-MM-DD HH:mm:ss');
                    cart.update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
                    cart.buyCargo = cargo_id ;
                    cart.buyUser = req.session.user._id;
                    cart.shopName = shopName;
                    cart.shopImage = shopImage;
                    cart.shopDescription = shopDescription;
                    cart.shopPrice = shopPrice;
                    cart.shopDelivery_fee = shopDelivery_fee;
                    cart.buyAdmin = buyAdmin;
                    cart.save((err)=>{
                        if(err) {
                            return res.json({
                                error: 1,
                                msg: '商品数据库错误'
                            })
                        }
                    UserModel.getUserByName(username,(err,user)=>{
                        if (err) {
                            return res.json({
                                error: 1,
                                msg: '数据库错误'
                            })
                        }
                        if(!user) {
                            return res.json({
                                error: 1,
                                msg: '用户不存在'
                            })
                        }
                        user.cart_goods_num +=1;
                        user.save();
                        cart.buyNum +=1;
                        cart.save();
                        return res.json({
                            error: 0,
                            msg: '商品购买成功',
                            buy:true
                        })
                    })
                })
            })
        })
    },
//    显示在管理员删除页面的商品
    cargoDeleteShow:(req,res,next)=>{
        let _id = req.session.user._id;
        //查找该管理员添加的所有商品
        CargoModel.find({addUser:_id}).exec((err,cargos)=>{
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!cargos) {
                return res.json({
                    error: 1,
                    msg: '商品不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '找到商品了',
                cargos
            })
        })
    },
//    管理员删除商品（删除数据库的商品，还要删除购物车中的商品）
    cargoDelete:(req,res,next)=>{
        // console.log(req.query);
        //根据id查找到商品
        let user_id = req.session.user._id;
        CargoModel.findOne({_id:req.query[0]}).exec((err,cargo)=>{
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!cargo) {
                return res.json({
                    error: 1,
                    msg: '商品不存在1'
                })
            }
        //   查找到商品就删除
            CargoModel.deleteOne({_id:req.query[0]}).exec((err,cargo)=> {
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '商品数据库错误1'
                    })
                }
                if (!cargo) {
                    return res.json({
                        error: 1,
                        msg: '商品不存在2'
                    })
                }
                ShoppingCartModel.find().exec((err,cart) => {
                    if (err) {
                        return res.json({
                            error: 1,
                            msg: '商品数据库错误2'
                        })
                    }
                    ShoppingCartModel.findOne({buyCargo: req.query[0]}, (err, cargo) => {
                        if (err) {
                            return res.json({
                                error: 1,
                                msg: '商品数据库错误3'
                            })
                        }
                        ShoppingCartModel.deleteOne({buyCargo: req.query[0]}, (err, cargo) => {
                            if (err) {
                                return res.json({
                                    error: 1,
                                    msg: '商品数据库错误4'
                                })
                            }
                            //    删除商品后在查找到管理员用户的addCargoCount的数量减一
                            UserModel.findOne({_id:user_id}).exec((err, user) => {
                                if (err) {
                                    return res.json({
                                        error: 1,
                                        msg: '商品数据库错误'
                                    })
                                }
                                if (!user) {
                                    return res.json({
                                        error: 1,
                                        msg: '用户不存在'
                                    })
                                }
                                user.addCargoCount -= 1;
                                user.save();
                                return res.json({
                                    error: 0,
                                    msg: '商品删除成功'
                                })
                            })

                        })
                    });
                })
              })
            })
    },
//   通过类型进行搜索
    cargoTheme:(req,res,next)=>{
        CargoModel.find().distinct('type').exec((err,types)=>{
            // console.log(types);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!types) {
                return res.json({
                    error: 1,
                    msg: '类型不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '找到了',
                types
            })
        })
    },
//    通过类型内容查找
    cargoThemeContent:(req,res,next)=>{
        // console.log(req.query);
        CargoModel.find({$or:[{type:req.query[0] },{start_city:req.query[0]}]}).exec((err,cargos)=>{
            // console.log(cargos);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!cargos) {
                return res.json({
                    error: 1,
                    msg: '类型不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '找到了',
                cargos
            })
        })
    },
//   通过出发城市查找
    cargoCityContent:(req,res,next)=>{
        CargoModel.find().distinct('start_city').exec((err,citys)=>{
            // console.log(types);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!citys) {
                return res.json({
                    error: 1,
                    msg: '类型不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '找到了',
                citys
            })
        })
    },
    // 搜索内容显示
    cargoSearch:(req,res,next)=>{
        let title= req.body.title;
        CargoModel.find({$or:[{description:{$regex:title} },{cargo_name:{$regex:title}}]}).sort({'cargo_price':-1}).exec(function (err,cargos) {
            // console.log(cargos);
            if (err) {
                return res.json({
                    error: 1,
                    msg: '商品数据库错误'
                })
            }
            if(!cargos) {
                return res.json({
                    error: 1,
                    msg: '类型不存在'
                })
            }
            return res.json({
                error: 0,
                msg: '商品找到了',
                cargos
            })
        })
    },
//    修改商品信息
    cargoUpdate:(req,res,next)=>{
        // console.log(req.body);
        let cargo_name = req.body.values.cargo_name;
        let cargo_image = req.body.values.cargo_image;
        let cargo_photos =[req.body.values.cargo_photo1,req.body.values.cargo_photo2,req.body.values.cargo_photo3,req.body.values.cargo_photo4,
            req.body.values.cargo_photo5,req.body.values.cargo_photo6];
        let description = req.body.values.description;
        let tags= [req.body.values.tag1,req.body.values.tag2,req.body.values.tag3,req.body.values.tag4];
        let cargo_actives = [req.body.values.cargo_active1,req.body.values.cargo_active2,req.body.values.cargo_active3,
            req.body.values.cargo_active4,req.body.values.cargo_active5];
        let cargo_price = req.body.values.cargo_price;
        let cargoAllNum = req.body.values.cargoAllNum;
        let before_price =req.body.values.before_price;
        let delivery_fee = req.body.values.delivery_fee;
        let delivery = req.body.values.delivery;
        let success_fee = req.body.values.success_fee;
        let cargo_remain = req.body.values.cargoAllNum;
        let type = req.body.values.type;
        let start_city = req.body.values.start_city;
        let start_time = req.body.values.start_time;
        //格式化日期
        let date = new Date();
        let update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
        CargoModel.getCargoByCargoName(cargo_name,(err,cargo)=>{
            if (err) {
                return res.json({
                    error: 1,
                    msg: '数据错误'
                })
            }
            if (!cargo) {
                return res.json({
                    error: 1,
                    msg: '商品不存在'
                })
            }
            CargoModel.updateOne({cargo_name},{cargo_name, cargo_image, description, tags, cargo_actives, cargo_price,
                cargoAllNum, before_price, delivery_fee, delivery, success_fee,update_time, cargo_remain,
                type, cargo_photos, start_city, start_time}).exec((err)=>{
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '数据错误'
                    })
                }
                return res.json({
                    error: 0,
                    msg: '信息更新成功'
                })
            })
        })
    }
};
module.exports = cargoHandle;





