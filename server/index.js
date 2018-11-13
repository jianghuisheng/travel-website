const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const userPath=require('./path/path.js');

const db = require('./model/db');
app.use( bodyParser.urlencoded({ extended:false }));

app.use(cookieParser('love'));
app.use(session({
    secret:'love',
    store:new MongoStore({
        url:'mongodb://localhost/ReactSession'
    }),
    resave: true,
    saveUninitialized:false,
    cookie: {maxAge: 60 * 1000 * 30 * 60},
    name:'sessPublish',
}));

app.use(userPath);

app.listen(6000,()=>{
    console.log('大项目开始征程');
});