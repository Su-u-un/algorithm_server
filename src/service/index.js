const mysql = require('mysql2')

// 本地使用localhost
// 这里有个数据库bug需要修复，尝试复现
const pool = mysql.createPool({
    host: '47.242.73.45',
    user: 'root',
    password: '123456',
    database: 'algovis',
    multipleStatements: true
})

// 直接使用pool
exports.query = (sql,values) => {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err, connection) => {
            if(err) {console.log('1');reject(err)}
            else{
                connection.query(sql, values, (error, rows) => {
                    if(error) {
                        console.log('2')
                        reject(error)
                        throw error
                    }
                    else {
                        resolve(rows)
                    }
                    // 释放链接
                    connection.release()
                })
            }
        })
    })
}
exports.execute = (sql,values) => {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err, connection) => {
            if(err) {console.log('1');reject(err)}
            else{
                connection.execute(sql, values, (error, rows) => {
                    if(error) {
                        console.log('2')
                        reject(error)
                        throw(error)
                    }
                    else {
                        resolve(rows)
                    }
                    // 释放链接
                    connection.release()
                })
            }
        })
    })
}