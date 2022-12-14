const s3 = require('./aws')
const corsOptions = require('./cors')
const connectRedis = require('./redis')
const connectToDatabase = require('./database')

module.exports = {
    s3,
    corsOptions,
    connectRedis,
    connectToDatabase,
}
