const db = require('./index')

class FileService{
    // 查询file存在
    async exist(value){
        const _sql = "SELECT * FROM file WHERE algo_type = ? AND file_name = ?  AND folder_name = ? AND create_by = ?"
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 新增file
    async add(value){
        const _sql = 'INSERT INTO `file` (file_name,folder_id,real_url,type) VALUES (?,?,?,?)'
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 更新file
    async update(value){
        const _sql = `UPDATE file SET file_name = ? , type=? WHERE real_url = ?`
        const [result] = await db.execute(_sql,value)
        return result
    }
    async delete(value){
        const _sql = `DELETE FROM file WHERE filename = ? AND folder_id = ? AND createBy = ?`
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 读取算法文件夹
    async readFolder(value){
        const _sql = `SELECT id,folder_name FROM folder WHERE algo_id = ?;`
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 读取算法文件夹ID
    async readFolederID(value){
        const _sql = `SELECT id FROM folder WHERE folder_name = ? AND algo_type = ? AND create_by = ?;`
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 读取算法
    async readFile(value){
        const _sql = `SELECT real_url,file_name FROM file WHERE folder_id = ?`
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 新增Algo
    async addAlgo(value){
        const _sql = `INSERT INTO algo (algo_type,create_by) VALUES (?,?)`
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 更新Algo
    async updateAlgo(value){
        const _sql = `UPDATE algo SET algo_type = ? WHERE id = ?`
        const [result] = await db.execute(_sql,value)
        return result
    }
    async list(value){
        const _sql = `SELECT id,algo_type FROM algo WHERE create_by = ?;`
        const [result] = await db.execute(_sql,value)
        return result
    }
    async getFileID(value){
        const _sql = `SELECT id FROM file ORDER BY id DESC LIMIT 1;`
        const [result] = await db.execute(_sql,value)
        return result
    }
    // 查询folder是否存在
    async existFolder(value){
        const _sql = `SELECT * FROM folder WHERE id = ?;`
        const [result] = await db.execute(_sql,value)
        return result
    }
    async updateFolder(value){
        const _sql = `UPDATE folder SET folder_name = ? WHERE id = ?;`
        const [result] = await db.execute(_sql,value)
        return result
    }
    async addFolder(value){
        const _sql = `INSERT INTO folder (folder_name,id,algo_id) VALUES (?,?,?)`
        const [result] = await db.execute(_sql,value)
        return result
    }
}

module.exports = new FileService()