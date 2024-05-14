const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session')
const cors = require('@koa/cors')

const JWT = require('../utils/jwt')
const registerRouters = require('../router')
const app = new Koa()

const SESSION = {
    key: 'sun',/** (string) cookie key（默认为 koa.sess） */
    /** （数字 || 'session'）maxAge，毫秒数（默认为 1 天） */
    /** 'session'将导致 cookie 在会话/浏览器关闭时过期 */
    /** 如果会话 cookie 被盗，该 cookie 将永远不会过期 */
    maxAge: 10000 * 60 * 5,// 5min
    // autoCommit: true, /** (boolean) 自动提交标头 (默认 true) */
    // overwrite: true, /** /** (boolean) 是否可以覆盖(默认 true) */
    // httpOnly: true, /** (boolean) httpOnly 或 not (默认 true) */
    // signed: true, /** (boolean) 是否签名(默认 true) */
    // rolling: false, /** (boolean) 强制在每个响应上设置会话标识符 cookie。过期时间重置为原来的maxAge，重置过期倒计时。 （默认为假）*/
    // renew: false, /** (boolean) 当会话即将过期时更新会话，这样我们就可以始终保持用户登录状态。（默认为 false）*/
    // secure: true, /** （布尔值）安全 cookie*/
    // sameSite: null, /** (字符串) 会话 cookie SameSite 选项 (默认为 null，不要设置) */
};
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}))
app.use(session(SESSION, app));
// 加盐
app.keys = ['s', 'u', 'n']

app.use(bodyparser({
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
}))

// 验证token中间件(在注册路由前)
app.use(async (ctx, next) => {
    // 如果token有效 ,next() 
    // 如果token过期了, 返回401错误
    const url = ctx.url
    const index = url.indexOf("/", 1);
    if (url.substring(0, index) === "/user") {
        await next()
        return
    }
    const token = ctx.header["authorization"]
    //token解析
    if (token) {
        var payload = JWT.verify(token.slice(1, -1))
        if (payload) {
            // 每一次请求,重新生成新的token
            const newToken = JWT.generate({
                _id: payload._id,
                username: payload.username
            }, "7d")
            ctx.append("Authorization", newToken)
            await next()
        }else {
            ctx.status = 401
            ctx.body = {
                code: "-1",
                error: "登录信息过期，请重新登录"
            }
        }
    } else {
        ctx.status = 403
        ctx.body = {
            code: "-1",
            error: "token无效，请重新登录"
        }
    }
        
    
})

registerRouters(app)

module.exports = app