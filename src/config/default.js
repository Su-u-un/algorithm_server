const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    SERVER_PORT,
    SECRET_KEY
} = process.env