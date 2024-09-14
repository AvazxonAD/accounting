const { Pool } = require('pg')

const pool = new Pool({
    port: 5432,
    host: 'localhost',
    user: 'postgres',
    password: '1101jamshid',
    database: 'jurnal'
})

module.exports = pool