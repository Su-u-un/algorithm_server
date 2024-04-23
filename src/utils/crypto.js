const crypto = require('crypto-js')
const {SECRET_KEY} = require('../config/default')

exports.encrypt = (pwd)=>{
    const encrypted = crypto.AES.encrypt(pwd,SECRET_KEY).toString()
    return encrypted
}

exports.decrypt = (pwd)=>{
    const decrypted = crypto.AES.decrypt(pwd,SECRET_KEY).toString(crypto.enc.Utf8)
    return decrypted
}
