const { Pool } = require('pg')

const pool = new Pool({
    port: 5432,
    host: '147.45.107.174',
    user: 'postgres',
    password: '1101jamshid',
    database: 'jurnal'
})

module.exports = pool