const db = require('./index')

class UserService{
    async register(value){
        // const _sql = 'INSERT INTO `user` (username,password) VALUES (?,?)'
        // return db.query(_sql,value)
        const _sql = `INSERT INTO user SET username=?,password=?,phone=?`
        const result = await db.execute(_sql,value)
        return result
    }
    async exist(value){
        const _sql = "SELECT * FROM user WHERE username = ? || phone = ?";
        const result = await db.execute(_sql,value)
        return result
    }
    async login(value){
        const _sql = `SELECT password,id FROM user WHERE username = ?;`
        const result = await db.query(_sql,value)
        return result
    }
    async list(value){
        const _sql = `SELECT id,algo_type FROM algo WHERE create_by = ? AND del_tag != 0;`
        const result = await db.execute(_sql,value)
        return result
    }
}

module.exports = new UserService()