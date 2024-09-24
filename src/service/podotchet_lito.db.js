const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')


const getByAllPodotChet = asyncFunctionHandler(async (name, rayon, user_id) => {
    const result = await pool.query(`SELECT * FROM spravochnik_podotchet_litso WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `, [name, rayon, user_id]);
    return result.rows[0]
})

const createPodotChet = asyncFunctionHandler(async (name, rayon, user_id) => {
    const result = await pool.query(`INSERT INTO spravochnik_podotchet_litso(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
    `, [name, rayon, user_id]);
    return result.rows[0]
})

const getAllPodotChet = asyncFunctionHandler(async (user_id, offset, limit) => {
    const result = await pool.query(`SELECT id, name, rayon FROM spravochnik_podotchet_litso  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `, [user_id, offset, limit])
    return result
})

const totalPodotChet = asyncFunctionHandler(async (user_id) => {
    const result = await pool.query(`SELECT COUNT(id) AS total FROM spravochnik_podotchet_litso WHERE isdeleted = false AND user_id = $1`, [user_id]);
    return result.rows[0]
})

const getByIdPodotchet = asyncFunctionHandler(async (user_id, id) => {
    const result = await pool.query(`SELECT * FROM spravochnik_podotchet_litso  WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [id, user_id])
    return result.rows[0]
})


const updatePodotchet = asyncFunctionHandler(async (name, rayon, user_id, id) => {
    const result = await pool.query(`UPDATE  spravochnik_podotchet_litso SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4 AND isdeleted = false
        RETURNING *
    `, [name, rayon, user_id, id]);
    return result.rows[0]
})

const deletePodotchet = asyncFunctionHandler(async (id) => {
    const result = await pool.query(`UPDATE spravochnik_podotchet_litso SET isdeleted = $1 WHERE id = $2 AND isdeleted = false RETURNING *`, [true, id])
    return result.rows[0]
})

module.exports = {
    getByAllPodotChet,
    createPodotChet,
    getAllPodotChet,
    totalPodotChet,
    getByIdPodotchet,
    updatePodotchet,
    deletePodotchet
}