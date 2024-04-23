const db = require('./index')

class FileService{
    async exist(value){
        const _sql = "SELECT * FROM file WHERE algo_type = ? AND file_name = ?  AND folder_name = ? AND create_by = ?"
        const [result] = await db.execute(_sql,value)
        return result
    }
    async save(value){
        const _sql = 'INSERT INTO `file` (file_name,folder_id,real_url,type,) VALUES (?,?,?,?)'
        const [result] = await db.execute(_sql,value)
        return result
    }
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
    async readFoleder(value){
        const _sql = `SELECT id FROM algo WHERE folder_name = ? AND algo_type = ? AND create_by = ?;`
        const [result] = await db.execute(_sql,value)
        return result
    }
    async readFile(value){
        const _sql = `SELECT real_url,file_name FROM file WHERE folder_id = ?`
        const [result] = await db.execute(_sql,value)
        return result
    }
    async add(value){
        const _sql = `INSERT INTO algo (folder_name,algo_type,create_by) VALUES (?,?,?)`
        const [result] = await db.execute(_sql,value)
        return result
    }
}

module.exports = new FileService()