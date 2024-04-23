const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session')
const cors = require('@koa/cors')

const registerRouters = require('../router')
const app = new Koa()

const SESSION = {
    key: 'sun',/** (string) cookie key（默认为 koa.sess） */
    /** （数字 || 'session'）maxAge，毫秒数（默认为 1 天） */
    /** 'session'将导致 cookie 在会话/浏览器关闭时过期 */
    /** 如果会话 cookie 被盗，该 cookie 将永远不会过期 */
    maxAge: 10000*60*5,// 5min
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
    origin: 'http://localhost:3001',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}))
app.use(session(SESSION, app));
// 加盐
app.keys = ['s','u','n']

app.use(bodyparser({
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
}))
registerRouters(app)

module.exports = app