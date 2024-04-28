const KoaRouter = require('@koa/router')
const fileController = require('../controller/file.controller')

const fileRouter = new KoaRouter({prefix: '/file'})

fileRouter.post('/save', fileController.save)
fileRouter.get('/delete', fileController.delete)
fileRouter.get('/readfile', fileController.readfile)
fileRouter.post('/saveFolder', fileController.saveFolder)
fileRouter.get('/readFolder', fileController.readFolder)
fileRouter.get('/readPublic', fileController.readPublic)
fileRouter.get('/readFolderPublic', fileController.readFolderPublic)
fileRouter.get('/list', fileController.list)
fileRouter.get('/getFileID', fileController.getFileID)
fileRouter.post('/build',fileController.build)
fileRouter.post('/saveAlgo',fileController.saveAlgo)

module.exports = fileRouter