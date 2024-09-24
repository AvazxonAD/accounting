const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const getByInnOrganization = asyncFunctionHandler(async (inn, user_id) => {
    const result = await pool.query(`SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2 AND isdeleted = false
    `, [inn, user_id]);
    return result.rows[0]
})

const createOrganization = asyncFunctionHandler(async (name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, user_id, okonx) => {
    const result = await pool.query(`INSERT INTO spravochnik_organization(
        name, bank_klient, raschet_schet, 
        raschet_schet_gazna, mfo, inn, user_id, okonx
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
    `, [name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, user_id, okonx]);
    return result.rows[0]
})

const getAllOrganization = asyncFunctionHandler(async (user_id, offset, limit) => {
    result = await pool.query(`SELECT id, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, okonx
        FROM spravochnik_organization  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2
        LIMIT $3
    `, [user_id, offset, limit])
    return result.rows
})

const totalOrganization = asyncFunctionHandler(async (user_id) => {
    const result = await pool.query(`SELECT COUNT(id) AS total FROM spravochnik_organization WHERE isdeleted = false AND user_id = $1`, [user_id]);
    return result.rows[0]
})

const getByIdOrganization = asyncFunctionHandler(async (user_id, id) => {
    const result = await pool.query(`SELECT * FROM spravochnik_organization WHERE  user_id = $1 AND id = $2 AND isdeleted = false `, [user_id, id]) 
    return result.rows[0]
})

const updateOrganization = asyncFunctionHandler(async (name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, user_id, id, okonx) => {
    const result = await pool.query(`UPDATE spravochnik_organization 
        SET name = $1, bank_klient = $2, raschet_schet = $3, raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $9
        WHERE user_id = $7 AND id = $8
        RETURNING *
    `, [name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, user_id, id, okonx]);
    return result.rows[0];
})

const deleteOrganization = asyncFunctionHandler(async (id) => {
    const result = await pool.query(`UPDATE spravochnik_organization SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, id])
    return result.rows[0]
})

module.exports = {
    getByInnOrganization,
    createOrganization,
    getAllOrganization,
    totalOrganization,
    getByIdOrganization,
    updateOrganization,
    deleteOrganization
}