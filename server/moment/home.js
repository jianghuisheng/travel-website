const UserModel = require('../model/User.js');
//引入密码加密的模块
const sha1 = require('sha1');
//引入格式化日期的moment模块
const moment = require('moment');
//导入验证模块
const validator = require('validator');
const session = require('express-session');
const createToken = require('../token/token');
// 发邮件
const nodemailer = require('nodemailer');

const home = {
    //   验证码
     setVerify:(req,res,next)=>{
         if(req.query[0]){
             let num = req.query[0];
             console.log(num);
             let verifyNum = '';
             for(i=0;i<6;i++){
                 verifyNum += Math.floor(Math.random()*10);
             }
             let transporter = nodemailer.createTransport({
                 service: 'qq',
                 port: 465,
                 secureConnection: true,
                 auth: {
                     user:'2315198050@qq.com',
                     pass: 'tlcohgygcqpmdjgj',
                 }
             });
             let mailOptions = {
                 from:' 2315198050@qq.com',
                 to:num,
                 subject: 'Hello',
                 html: "验证码："+ '<b>' + verifyNum + '</b>',
             };
             transporter.sendMail(mailOptions, (error, info) => {
                 if (error) {
                     return console.log(error);
                 }
                 // console.log('Message sent: %s', info.messageId);
                 return res.json({
                     error:0,
                     msg:'发送成功',
                     verifyNum
                 })
             });
         }else{
                 return res.json({
                     error: 1,
                     msg: '请先输入邮箱'
                 })
         }
    },
    // 注册用户
    zhuce: (req, res, next) => {
        // console.log('接收到注册的数据了');
        // console.log(req.query);
        let username = req.query.username;
        let email = req.query.email;
        let password = req.query.password;
        let admin = req.query.admin;
        //密码加密
        password = sha1(password);
        //格式化日期
        let date = new Date();
        let create_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
        let update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
        UserModel.getUserByName(username, (err, user) => {
            if (err) {
                return res.json({
                    error: 1,
                    msg: '用户名数据错误'
                })
            }
            if (user) {
                return res.json({
                    error: 1,
                    msg: '用户已注册'
                })
            }
            UserModel.getUserByAdmin(admin,(err,count)=>{
                if (err) {
                    return res.json({
                        error: 1,
                        msg: '管理员身份数据错误'
                    })
                }
                if(count>=3){
                    return res.json({
                        error: 1,
                        msg: '管理员人数超标，不能注册'
                    })
                }
                UserModel.getUserByEmail(email,(err,user) => {
                    if (err) {
                        return res.json({
                            error: 1,
                            msg: '邮箱数据错误'
                        })
                    }
                    if (user) {
                        return res.json({
                            error: 1,
                            msg: '邮箱已注册请重新注册'
                        })
                    }
                    let User = new UserModel({
                        username,
                        email,
                        password,
                        create_time,
                        update_time,
                        admin
                    });
                    User.save((err,user) => {
                        // console.log(user);
                        if (err) {
                            return res.json({
                                error: 1,
                                msg: '数据错误，无法保存'
                            })
                        }
                        return res.json({
                            error: 0,
                            msg: '用户注册成功',
                        })
                    })
                });
            });
        });
    },
    // 用户登陆
    login: (req, res, next) => {
       let loginName = req.body.username;
       let password = req.body.password;
        password = sha1(password);
        let patternName = /^[\u4E00-\u9FA5A-Za-z][0-9a-zA-Z]{1,10}/;
       let patternEmail = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/
        if(validator.matches(loginName,patternName)){
            UserModel.getUserByName(loginName,(err,user)=>{
                // console.log(user);
                if(err){
                    return res.json({
                        error:1,
                        msg:'登陆用户名查找数据错误'
                    })
                }
                if(!user){
                    return res.json({
                        error:2,
                        msg:'该用户未注册，请重新注册'
                    })
                }
                if(user.password===password){
                    let token = createToken(user.username);
                    req.session.token = token;
                    req.session.admin = user.admin;
                    req.session.username = user.username;
                    req.session.user = user;
                    next();
                    return res.json({
                            token:req.session.token,
                            admin:req.session.admin,
                            username:req.session.username,
                            user,
                            error:0,
                            msg:'登录成功'
                    });
                }else{
                      return res.json({
                            error:1,
                            msg:'密码错误，登陆失败'
                      })
                }
            })
        }else if(validator.matches(loginName,patternEmail)){
            UserModel.getUserByEmail(loginName,(err,user)=>{
                if(err){
                    return res.json({
                        error:1,
                        msg:'登陆邮箱查找数据错误'
                    })
                }
                if(!user){
                    return res.json({
                        error:2,
                        msg:'该用户未注册，请重新注册'
                    })
                }
                if(user.password===password){
                    let token = createToken(user.username);
                    req.session.token = token;
                    req.session.admin = user.admin;
                    req.session.username=user.username;
                    next();
                    return res.json({
                        token:req.session.token,
                        admin:req.session.admin,
                        username:req.session.username,
                        error:0,
                        msg:'登录成功'
                    });
                }else{
                    return res.json({
                        error:1,
                        msg:'邮箱密码错误，登陆失败'
                    })
                }
            })
        }else{
           return res.json({
               error:1,
               msg:'输入的内容不符合规则'
           })
        }
    },
    // 用户找回密码1
    search:(req,res,next)=>{
         let username = req.body.username;
         let email = req.body.email;
         UserModel.getUserByName(username,(err,user)=>{
             if (err) {
                 return res.json({
                     error: 1,
                     msg: '数据错误'
                 })
             }
             if (!user) {
                 return res.json({
                     error: 1,
                     msg: '用户名不存在'
                 })
             }
             UserModel.getUserByEmail(email,(err,user)=>{
                 if (err) {
                     return res.json({
                         error: 1,
                         msg: '数据错误'
                     })
                 }
                 if (!user) {
                     return res.json({
                         error:1 ,
                         msg: '邮箱未注册，请重新注册'
                     })
                 }
                 if(req.body.password){
                     let password = req.body.password;
                     password = sha1(password);
                     //格式化日期
                     let date = new Date();
                     let update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
                     UserModel.updateOne({username},{password,update_time},(err)=>{
                         if(err){
                             return res.json({
                                 error:1 ,
                                 msg: '数据库错误'
                             })
                         }
                         return res.json({
                             error: 0,
                             msg: '密码重置成功'
                         })
                     })
                 }else{
                      return res.json({
                          error:0,
                          msg: '请重新设置密码',
                          username
                      });
                 }
             })
         })
    },
    //设置页面
    info:(req,res,next)=>{
        // console.log(req.query);
        UserModel.getUserByName(req.query.infoUser,(err,user)=>{
            if(err){
                return res.json({
                    error:1,
                    msg:'查找用户数据错误'
                })
            }
            return res.json({
                error:0,
                msg:'用户找到了',
                user
            })
        })
    },
    //添加信息页面
    addInfo:(req,res,next)=>{
        // console.log(req.query.User);
        UserModel.getUserByName(req.query.User,(err,user)=>{
            if(err){
                return res.json({
                    error:1,
                    msg:'查找用户数据错误'
                })
            }
            return res.json({
                error:0,
                msg:'用户找到了',
                user
            })
        })
    },
    saveInfo:(req,res,next)=>{
        // console.log(req.query);
        let username =  req.query.username;
        let headPhoto = req.query.headPhoto;
        let address = req.query.address;
        let birthDay = req.query.birthDay;
        let phoneNumber = req.query.phoneNumber;
        let sex = req.query.sex;
        let signature = req.query.signature;
        //格式化日期
        let date = new Date();
        let update_time = moment(date).format('YYYY-MM-DD HH:mm:ss');
        UserModel.getUserByName(username,(err,user)=>{
            // console.log(user);
            if(err){
                return res.json({
                    error:1,
                    msg:'查找用户数据错误'
                })
            }
            if(!user){
                return res.json({
                    error:1,
                    msg:'用户不存在'
                })
            }
            UserModel.updateOne({username},{
                headPhoto,address,birthDay,phoneNumber,sex,signature,update_time
            },(err)=>{
                if(err){
                    return res.json({
                        error:1 ,
                        msg: '数据库错误'
                    })
                }
                return res.json({
                    error: 0,
                    msg: '用户信息添加成功'
                })
            })
        })
    }
};
module.exports = home;