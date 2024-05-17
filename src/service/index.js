const mysql = require('mysql2')

// 本地使用http://localhost
// 这里有个数据库bug需要修复，尝试复现
const pool = mysql.createPool({
    host: '47.242.73.45',
    user: 'root',
    password: 'root',
    database: 'algovis',
    multipleStatements: true
})

// 直接使用pool
exports.query = (sql,values) => {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err, connection) => {
            if(err) reject(err)
            else{
                connection.query(sql, values, (err, rows) => {
                    if(err) {
                        console.log('err',err);
                        reject(err)
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
            if(err) reject(err)
            else{
                connection.execute(sql, values, (err, rows) => {
                    if(err) {
                        console.log('err',err);
                        reject(err)
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

// const connection = pool.promise()

// module.exports = connection