const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { tashkentTime } = require('../utils/date.function')

const getByNamePereotsenkaService = async (name) => {
    try {
        const result = await pool.query(`SELECT * FROM pereotsenka_jur7 WHERE name = $1 AND isdeleted = false`, [name])
        if (result.rows[0]) {
            throw new ErrorResponse('This information has already been submitted', 409)
        }
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const pereotsenkaCreateService = async (data) => {
    try {
        const result = await pool.query(`
            INSERT INTO pereotsenka_jur7 (name, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [
                data.name,
                data.oy_1,
                data.oy_2,
                data.oy_3,
                data.oy_4,
                data.oy_5,
                data.oy_6,
                data.oy_7,
                data.oy_8,
                data.oy_9,
                data.oy_10,
                data.oy_11,
                data.oy_12,
                tashkentTime(),
                tashkentTime()
            ])
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getPereotssenkaService = async (offset, limit) => {
    try {
        const { rows } = await pool.query(`
            WITH data AS (
                SELECT id, name, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12
                FROM pereotsenka_jur7 WHERE isdeleted = false OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (SELECT COALESCE(COUNT(id), 0)::INTEGER FROM pereotsenka_jur7 WHERE isdeleted = false) AS total_count
            FROM data
        `, [offset, limit])
        return { data: rows[0]?.data || [], total: rows[0].total_count }
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByIdPereotsenkaService = async (id, ignore_ideleted = false) => {
    try {
        let ignore = ``
        if(!ignore_ideleted){
            ignore = `AND isdeleted = false`
        }
        const result = await pool.query(`SELECT * FROM pereotsenka_jur7 WHERE id = $1 ${ignore}`, [id])
        if (!result.rows[0]) {
            throw new ErrorResponse('pereotsenka not found', 404)
        }
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const updatePereotsenkaService = async (data) => {
    const result = await  pool.query(
        `
            UPDATE pereotsenka_jur7
            SET name = $1, oy_1 = $2, oy_2 = $3, oy_3 = $4, oy_4 = $5, oy_5 = $6, 
                oy_6 = $7, oy_7 = $8, oy_8 = $9, oy_9 = $10, oy_10 = $11, oy_11 = $12, 
                oy_12 = $13, updated_at = $14
            WHERE id = $15 AND isdeleted = false RETURNING * 
        `, [
        data.name, data.oy_1, data.oy_2, data.oy_3, data.oy_4, data.oy_5, data.oy_6,
        data.oy_7, data.oy_8, data.oy_9, data.oy_10, data.oy_11, data.oy_12,
        tashkentTime(), data.id
    ])
    return result.rows[0]
}

const deletePereotsenkaService = async (id) => {
    await  pool.query(`UPDATE pereotsenka_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, [id])
}

module.exports = {
    pereotsenkaCreateService,
    getByNamePereotsenkaService,
    getPereotssenkaService,
    getByIdPereotsenkaService,
    updatePereotsenkaService,
    deletePereotsenkaService
}