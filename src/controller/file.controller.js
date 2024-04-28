const fileService = require('../service/file.service')
const {Worker} = require("worker_threads")
const fs = require('fs')
const {resolve} = require('path')

const fileURL = resolve(__dirname,'../files')
// 用户文件区绝对路径
const absolute = resolve(__dirname,'../files/public')

class fileController {
    // 保存file(新增或更新)
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
            await fileService.add([filename,folderid,tempurl,type])
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
        const {id} = ctx.request.query
        // 得到所有文件的url
        const res = await fileService.readFile([id])
        // 为空说明是新建的文件夹，没有file，这边直接新建一个，并且写进数据库
        if(!res.length){
            // 定义一个独一无二的url，用它作真实路径
            const tempurl = `${new Date().getTime()}.txt`
            await fileService.add(['readme.md',id,tempurl,'md'])
            fs.writeFileSync(resolve(fileURL,tempurl), '');
        }
        const files = []
        for(let i=0;i<res.length;i++){
            const temp = fs.readFileSync(resolve(fileURL,res[i].real_url)).toString()
            files.push({"name":res[i].file_name,"content":temp,"realurl":res[i].real_url})
        }
        ctx.body = {
            code:'0',
            msg:'ok',
            data:files
        }
    }

    // 保存folder
    async saveFolder(ctx){
        const {id,algoid,foldername} = ctx.request.body
        // 两种情况，一种是保存，一种是更新
        // 通过判断id是否存在，因为前端会用最大id+1作为id
        const exist = await fileService.existFolder([id])
        if(exist.length){
            const res = await fileService.updateFolder([foldername,id])
            ctx.body = {
                code:'0',
                msg:'更新成功'
            }
        }
        else{
            const res = await fileService.addFolder([foldername,id,algoid])
            ctx.body = {
                code:'0',
                msg:'保存成功'
            }
        }        
    }
    // 读取folder
    async readFolder(ctx){
        const {id} = ctx.request.query
        const res = await fileService.readFolder([id])
        ctx.body = {
            code:'0',
            msg:'success',
            data:res
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
            data:files
        }
    }
    // 读取公共文件folder
    async readFolderPublic(ctx){
        const {foldername} = ctx.request.query 
        let folders = fs.readdirSync(`${absolute}/${foldername}`)
        let arr = []
        folders.forEach((folder) => {
            let obj = {}
            obj.folder_name = folder
            arr.push(obj)
        })
        ctx.body={
            code:'0',
            msg:'ok',
            data:arr
        }
    }
    // 保存Algo(新增或更新)
    async saveAlgo(ctx){
        const {id,algotype,username} = ctx.request.body
        // 如果不存在id，说明是新增
        if(!id){
            if(!algotype){
                ctx.body = {
                    code:'-1',
                    msg:'错误，请联系管理员'
                }
                return
            }
            const res = await fileService.addAlgo([algotype,username])
            ctx.body = {
                code:'0',
                msg:'保存成功',
                data:res
            }
        }
        // 否则是更新
        else{
            await fileService.updateAlgo([algotype,id])
            ctx.body = {
                code:'0',
                msg:'更新成功'
            }
        }
        
    }
    // 获取用户文件和公共文件
    async list(ctx){
        const data = ctx.request.query
        // 获取用户文件
        const file = await fileService.list([data.username])
        ctx.body = {
            code:'0',
            data:file
        }
    }
    // 获取当前最大用户文件id
    async getFileID(ctx){
        const res = await fileService.getFileID()
        ctx.body = {
            code:'0',
            data:res[0].id
        }
    }
}

module.exports = new fileController()