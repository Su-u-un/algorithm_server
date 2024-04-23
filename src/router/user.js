const KoaRouter = require('@koa/router')
const userController = require('../controller/user.controller')
const userMiddleware = require('../middleware/user.middleware')

const userRouter = new KoaRouter({prefix: '/user'})

// 登录
userRouter.post('/login', userMiddleware.verifyLogin, userController.login)
// 手机登录验证码
userRouter.post('/loginCaptcha', userMiddleware.verifyLoginCaptcha, userController.loginCaptcha)
// 注册
userRouter.post('/register',userMiddleware.verifyRegister, userController.register)
// 注册验证码
userRouter.post('/registerCaptcha',userMiddleware.verifyRegisterCaptcha,userController.registerCaptcha)

module.exports = userRouter