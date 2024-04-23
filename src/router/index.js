const fs = require('fs')

function registerRouters(app){
    const files = fs.readdirSync(__dirname)

    for(const file of files){
        if(file !== 'index.js'){
            const router = require(`./${file}`)
            app.use(router.routes()).use(router.allowedMethods())
        }
    }
}

module.exports = registerRouters