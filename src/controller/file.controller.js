const fileService = require('../service/file.service')
const {Worker} = require("worker_threads")
const fs = require('fs')
const {resolve} = require('path')

const fileURL = resolve(__dirname,'../files')

class fileController {
    // 保存file
    async save(ctx){
        const {filename,folderid,content,realurl} = ctx.request.body
        const type = filename.split('.')[filename.split('.').length-1]
        // 两种情况，一种是保存，一种是更新
        // 通过判断前端是否返回真实url
        if(!realurl){
            if(!folderid){
                ctx.body = {
                    code:'-1',
                    msg:'错误，请联系管理员'
                }
                return
            }
            // 定义一个独一无二的url，用它作真实路径
            const tempurl = `${new Date().getTime()}.txt`
            await fileService.save([filename,folderid,tempurl,type])
            fs.writeFileSync(resolve(fileURL,tempurl), content);
            ctx.body = {
                code:'0',
                msg:'保存成功'
            }
        }
        else{
            await fileService.update([filename,type,realurl])
            fs.writeFileSync(resolve(fileURL,realurl), content);

            ctx.body = {
                code:'0',
                msg:'更新成功'
            }
        }
        
    }
    // 删除file
    async delete(ctx){
        const data = ctx.request.query
        // const url = 
        // if(await fileService.delete([data.filename,data.id,data.username])){
        //     fs.unlinkSync(resolve(fileURL,data.username,data.filename));
        // }
        ctx.body = {
            code:'0',
            msg:'删除还没写'
        }
    }
    // 读取file
    async readfile(ctx){
        const {foldername,algotype,username} = ctx.request.query
        // 根据点击的算法找到算法id，用算法id去遍历他的文件
        const id = await fileService.readFoleder([foldername,algotype,username])
        // 得到所有文件的url
        const res = await fileService.readFile([id[0].id])
        const files = []
        for(let i=0;i<res.length;i++){
            const temp = fs.readFileSync(resolve(fileURL,res[i].real_url)).toString()
            files.push({"name":res[i].file_name,"content":temp,"realurl":res[i].real_url})
        }
        ctx.body = {
            code:'0',
            msg:'ok',
            id:id[0].id,
            data:files
        }
    }
    // build代码
    async build(ctx){
        let {url,content} = ctx.request.body
        content = content?content:fs.readFileSync(resolve(fileURL,url)).toString()
        const runWorker = (temp)=>{
            return new Promise((res, rej)=>{
                const worker = new Worker(resolve(__dirname,'../utils/work.js'), { workerData : {code:temp} })
                worker.on("message", res);
                worker.on("error", rej)
            })
            
        }
        const res = await runWorker(content)
        ctx.body = {
            code:'0',
            msg:'ok',
            data:res
        }
    }
    // 读取公共文件
    async readPublic(ctx){
        const {foldername,algotype} = ctx.request.query
        // 组装url 
        const url = resolve(__dirname,'../files/public',algotype,foldername)
        const files = []
        const temps = fs.readdirSync(url)
        for(let i=0;i<temps.length;i++){
            const content = fs.readFileSync(resolve(url,temps[i])).toString()
            files.push({"name":temps[i],"content":content})
        }

        ctx.body = {
            code:'0',
            msg:'ok',
            id:999,
            data:files
        }
    }
    // 保存folder
    async saveAlgo(ctx){
        const {foldername,algotype,username} = ctx.request.body
        const res = await fileService.add([foldername,algotype,username])
        // 判断是否存在这个，也不对，前端如果修改名，要把旧名字和新名字一起传回来。所以判断
        // 有没有传旧名字，这样就知道是改名还是新建。然后使用对应的serve
        ctx.body = {
            code:'0',
            msg:'ok',
            data:res
        }
    }
}

module.exports = new fileController()