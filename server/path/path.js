const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//用户
const home = require('../moment/home.js');
//商品
const cargoHandle = require('../moment/cargoHandle.js');
//购物车
const Cart = require('../moment/Cart.js');
//订单处理
const order = require('../moment/Order.js');


//登陆
app.post('/user/login',bodyParser.json(), home.login);
//注册
app.get('/user/zhuce', home.zhuce);
//验证码
app.get('/zhuce/getNum',home.setVerify);
//找回密码
app.post('/user/search',bodyParser.json(), home.search);
//找回密码的验证码
app.get('/search/getNum',home.setVerify);
//设置页面
app.get('/user/info',home.info);
//添加信息页面
app.get('/user/addInfo',home.addInfo);
//信息保存页面
app.get('/user/addUserInfo',home.saveInfo);



//商品处理
//添加商品页面
app.get('/cargo/add',cargoHandle.addCargo);
//首页查找到所有商品页面
app.get('/home/findCargo',cargoHandle.findAllCargo);
//商品详情页
app.get('/cargo/info',cargoHandle.getCargoInfo);
//商品收藏
app.get('/cargo/collected',cargoHandle.cargoCollected);
//商品购买
app.get('/cargo/buy',cargoHandle.cargoBuy);
//显示在响应管理员删除页面上
app.get('/show/addCargo',cargoHandle.cargoDeleteShow);
//管理员删除商品页面
app.get('/show/delete',cargoHandle.cargoDelete);
//通过类型查找，主题页面
app.get('/home/findCargoTheme',cargoHandle.cargoTheme);
//通过类型查抄内容
app.get('/theme/content',cargoHandle.cargoThemeContent);
//通过出发城市查找
app.get('/city/content',cargoHandle.cargoCityContent);
//关于我们页面的搜索内容
app.post('/about/search',bodyParser.json(),cargoHandle.cargoSearch);
//商品信息更改
app.post('/cargo/update',bodyParser.json(),cargoHandle.cargoUpdate);


//购物车
//添加至购物车
app.get('/show/shoppingCart',Cart.showCart);
//删除购物车中的商品
app.post('/user/cartCargo/delete',bodyParser.json(),Cart.deleteCartCargo);
//用户付款成功结算成功后
app.post('/user/buyGood',bodyParser.json(),Cart.addOrder);

//显示所有订单页面
app.post('/user/get/order',bodyParser.json(),Cart.userOrderShow);
//管理员显示所有订单页面
app.post('/admin/get/order',bodyParser.json(),Cart.adminOrderShow);

//显示客户的收藏
app.post('/user/get/collect',bodyParser.json(),Cart.userCollectShow);
//点击取消收藏
app.post('/user/collect/delete',bodyParser.json(),Cart.userCollectDelete);

//订单状态处理页面
app.post('/admin/order/status',bodyParser.json(),order.adminOrderStatus);
app.post('/user/order/status',bodyParser.json(),order.userOrderStatus);

//订单评价
app.post('/user/comment',bodyParser.json(),order.orderComment);
//发表评论
app.post('/user/comment/add',bodyParser.json(),order.orderCommentAdd);
//显示商品的所有评论
app.post('/cargo/comment/show',bodyParser.json(),order.orderCommentShow);

module.exports = app;