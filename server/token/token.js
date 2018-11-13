//创建token
const jwt = require ('jsonwebtoken');

createToken = (username)=>{
    // Token 数据
    const payload = {
       name:username,
       admin:true
    };
    // 密钥
    const secret = '#$$#';
    // 签发 Token
    const token = jwt.sign(payload, secret, { expiresIn: '1day' });

    return token;
};
module.exports = createToken;