const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URI
})

pool.connect()
    .then(()=>console.log('Database Connected'))
    .catch((err)=>console.error('error:',err))

module.exports = pool