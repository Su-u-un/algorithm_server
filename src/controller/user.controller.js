const userService = require('../service/user.service')
const JWT = require('../utils/jwt')
const fs = require('fs')
const {resolve,join} = require('path')
const captcha = require('captchapng')
const axios = require('axios')

const {encrypt,decrypt} = require('../utils/crypto')
// 用户文件区绝对路径
const absolute = resolve(__dirname,'../files/public')

class UserController{
    // 注册
    async register(ctx){
        const data = ctx.request.body
        // 注册成功清除验证码
        ctx.session = null
        const cipherPWD = encrypt(data.password)
        // 数据库插入注册数据
        await userService.register([data.username,cipherPWD,data.phone])
        ctx.body = {
            code:'0',
            msg:"success"
        }
    }
    // 注册手机验证码
    async registerCaptcha(ctx){
        // 获取手机号
        const phone = ctx.request.body.phone
        // 生成手机验证码，存入session
        const temp = parseInt(Math.random()*9000+1000)
        const value = temp.toString();
        // 发送短信
        /**这边关掉验证码，直接从后端抄 */
        ctx.session[phone] = value
        ctx.body={
            code:'0',
            msg:"success",
            data:value
        }
        // await axios({
        //     url:'https://dfsns.market.alicloudapi.com/data/send_sms',
        //     method: 'post',
        //     headers:{
        //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        //         "Authorization":"APPCODE 56af8f0761c043c3af247b78b1be533b"
        //     },
        //     data:{
        //         'content' : 'code:'+value,
        //         'template_id' : 'CST_ptdie100',
        //         'phone_number' : phone
        //     }
        // }).then(res => {
        //     ctx.session[phone] = value
        //     ctx.body = {
        //         code:'0',
        //         msg:"success"
        //     }
        // }).catch(err=>{
        //     ctx.body = {
        //         code:'0',
        //         msg:err
        //     }
        // })
    }
    //登录
    async login(ctx){
        const data = ctx.request.body
        // 如果是手机登录
        if(data.phone){
            // 登录成功清除验证码
            ctx.session = null
            // 获取用户名
            const users = await userService.exist(["",data.phone])
            // 生成token(用户信息,有效时间0.5天)
            const token = JWT.generate({
                _id: users[0]._id,
                username: users[0].username
            }, "0.5d")
            // 获取用户文件
            const temp = await userService.list([users[0].username])
            // 获取系统文件
            let arr = []
            let files = fs.readdirSync(absolute);
            let id = 0
            files.forEach((file) => {
                let folders = fs.readdirSync(`${absolute}/${file}`)
                folders.forEach((folder) => {
                    let obj = {}
                    obj.id = id++
                    obj.folder_name = folder
                    obj.algo_type = file
                    arr.push(obj)
                })
            })
            // 请求头返回token
            // ctx.append('Authorization',token)
            ctx.body = {
                code:0,
                msg:"success",
                list:temp,
                public:arr,
                token:token,
                username:users[0].username
            }
        }
        else{
            // 取出数据库密码进行解密，校验密码正误
            const result = await userService.login([data.username])
            const cipher = decrypt(result[0].password)
            // 正确传递正确并且传递list元素
            if(cipher === data.password){
                // 生成token(用户信息,有效时间0.5天)
                const token = JWT.generate({
                    _id: result[0]._id,
                    username: result[0].username
                }, "0.5d")
                const temp = await userService.list([data.username])
                // 请求头返回token
                // ctx.append('Authorization',token)
                ctx.body = {
                    code:0,
                    msg:"success",
                    list:temp,
                    token:token,
                    username:data.username
                }
            }else{
                ctx.body = {
                    code:-1,
                    msg:"密码错误"
                }
            }
        }
    }
    // 登录手机验证码
    async loginCaptcha(ctx){
        // 获取手机号
        const phone = ctx.request.body.phone
        // 生成手机验证码，存入session
        const temp = parseInt(Math.random()*9000+1000)
        const value = temp.toString();
        // 发送短信
        /**这边关掉验证码，直接从后端抄 */
        ctx.session[phone] = value
        ctx.body={
            code:'0',
            msg:"success",
            data:value
        }
        // await axios({
        //     url:'https://dfsns.market.alicloudapi.com/data/send_sms',
        //     method: 'post',
        //     headers:{
        //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        //         "Authorization":"APPCODE 56af8f0761c043c3af247b78b1be533b"
        //     },
        //     data:{
        //         'content' : 'code:'+value,
        //         'template_id' : 'CST_ptdie100',
        //         'phone_number' : phone
        //     }
        // }).then(res => {
        //     ctx.session[phone] = value
        //     ctx.body = {
        //         code:'0',
        //         msg:"success"
        //     }
        // }).catch(err=>{
        //     ctx.body = {
        //         code:'-1',
        //         msg:err
        //     }
        // })
    }
    async imgCaptcha(ctx){
        // 随机验证码
        const temp = parseInt(Math.random()*9000+1000)
        const value = temp.toString();
        // 生成验证码png
        const p = new captcha(100,30,value);
        p.color(72,201,176,128);  // First color: background (red, green, blue, alpha)
        p.color(255, 248, 220, 128); // Second color: paint (red, green, blue, alpha)
        // 转化base64
        const img = p.getBase64();
        // 存入session
        ctx.session.imgCaptcha = value;
        ctx.body = {
            code:'0',
            captcha:img
        };
    }
}

module.exports = new UserController()