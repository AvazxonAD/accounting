const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const getByNameRegion = asyncFunctionHandler(async ( name ) => {
    const result = await pool.query(`SELECT * FROM regions WHERE name = $1 AND isdeleted = false`, [name]);
    return result.rows[0]
})

const create_region = asyncFunctionHandler(async ( name ) => {
    const result = await pool.query(`INSERT INTO regions(name) VALUES($1) RETURNING *`, [name]);
    return result.rows[0]
})

const get_all_region = asyncFunctionHandler(async () => {
    const result = await pool.query(`SELECT id, name FROM regions WHERE isdeleted = false ORDER BY id`)
    return result.rows
})

const getByIdRegion = asyncFunctionHandler(async ( id ) => {
    const result = await pool.query(`SELECT id, name FROM regions WHERE isdeleted = false AND id = $1`, [id])
    return result.rows[0]
})

const update_region = asyncFunctionHandler(async ( id, name ) => {
    const result = await pool.query(`UPDATE regions SET name = $1 WHERE id = $2 RETURNING *`, [name, id])
    return result.rows[0]
})


const delete_region = asyncFunctionHandler(async ( id ) => {
    const result = await pool.query(`UPDATE regions SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, id])
    return result.rows[0]
})


module.exports = {
    getByNameRegion,
    create_region,
    get_all_region,
    getByIdRegion,
    update_region,
    delete_region
}