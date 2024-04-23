const userService = require('../service/user.service')

//用户注册验证
exports.verifyRegister = async(ctx,next)=>{
    const data = ctx.request.body
    // 处理手机验证码，防止验证码错误
    if(!ctx.session[data.phone]) {//验证是否过期或者被篡改
        ctx.body = {
            code:'-2',
            msg:"验证码已过期，请重新获取"
        }
        return
    }
    if(data.captcha !== ctx.session[data.phone]){
        ctx.body = {
            code:'-2',
            msg:"验证码不正确，请重新输入"
        }
        return
    }
    // 处理发来的参数，防止数据库操作报错
    if(!data.username||!data.password){
        ctx.body={
            code: "-1",//返回信息
            msg: "用户名密码不能为空"
        }
        return
    }
    // 判断是否已存在此用户
    const user = await userService.exist([data.username,""])
    if(user.length){
        ctx.body = {
            code:'-2',
            msg:"用户已存在,请登录"
        }
        return
    }
    
    await next()
}

//用户登录验证
exports.verifyLogin = async(ctx,next)=>{
    const data = ctx.request.body
    // 如果存在验证码说明是手机登录
    if(data.captcha){
        // 处理手机验证码，防止验证码错误
        if(!ctx.session[data.phone]) {//验证是否过期或者被篡改
            ctx.body = {
                code:'-2',
                msg:"验证码已过期，请重新获取"
            }
            return
        }
        if(data.captcha !== ctx.session[data.phone]){
            ctx.body = {
                code:'-2',
                msg:"验证码不正确，请重新输入"
            }
            return
        }
    }
    else{
        // 处理发来的参数，防止数据库操作报错
        if(!data.username||!data.password){
            ctx.body={
                code: "-1",//返回信息
                msg: "用户名密码不能为空"
            }
            return
        }
        // 判断是否已存在此用户
        const users = await userService.exist([data.username,""])
        if(!users.length){
            ctx.body = {
                code:'-2',
                msg:"用户不存在,请注册"
            }
            return
        }
    }
    
    await next()
}

// 登录请求手机验证码，查看手机号是否存在
exports.verifyLoginCaptcha = async(ctx,next)=>{
    const data = ctx.request.body
    const users = await userService.exist(["",data.phone])
    if(!users.length){
        ctx.body = {
            code:'-2',
            msg:"用户不存在,请注册"
        }
        return
    }

    await next()
}
// 注册请求手机验证码，查看手机号是否存在
exports.verifyRegisterCaptcha = async(ctx,next)=>{
    const data = ctx.request.body
    const users = await userService.exist(["",data.phone])
    if(users.length){
        ctx.body = {
            code:'-2',
            msg:"用户已存在,请登录"
        }
        return
    }

    await next()
}

//图片验证码验证
exports.verifyImgCaptcha = async(ctx,next)=>{
    const data = ctx.request.body.captcha

    if(!ctx.session.imgCaptcha) {//验证是否过期或者被篡改
        ctx.body = {
            code:'-2',
            msg:"验证码已过期，请重新获取"
        }
        return
    }
    if(data !== ctx.session.imgCaptcha){
        ctx.body = {
            code:'-2',
            msg:"验证码不正确"
        }
        return
    }
    await next()
}