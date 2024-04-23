const KoaRouter = require('@koa/router')
const fileController = require('../controller/file.controller')

const fileRouter = new KoaRouter({prefix: '/file'})

fileRouter.post('/save', fileController.save)
fileRouter.get('/delete', fileController.delete)
fileRouter.get('/readfile', fileController.readfile)
fileRouter.get('/readPublic', fileController.readPublic)
fileRouter.post('/build',fileController.build)
fileRouter.post('/saveAlgo',fileController.saveAlgo)

module.exports = fileRouter