const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createAccess = handleServiceError(async (role_id, user_id) => {
    await pool.query(`INSERT INTO access (role_id, user_id) VALUES($1, $2)`, [role_id, user_id])
})

const getByRoleIdAccessDB = handleServiceError(async (region_id, role_id) => {
    const access = await pool.query(`
        SELECT 
            access.id,
            access.kassa,
            access.bank,
            access.spravochnik,
            access.organization,
            access.region_users,
            access.smeta,
            access.region,
            access.role,
            access.users,
            access.shartnoma,
            access.jur3,
            access.jur4,
            role.name AS role_name
        FROM access
        JOIN users ON access.user_id = users.id
        JOIN regions ON regions.id = users.region_id
        JOIN role ON role.id = access.role_id
        WHERE regions.id = $1 AND role.id = $2
    `, [region_id, role_id])
    return access.rows[0]
})

const getByIdAccessDB = handleServiceError(async (region_id, access_id) => {
    const access = await pool.query(`
        SELECT 
            access.id,
            access.kassa,
            access.bank,
            access.spravochnik,
            access.organization,
            access.region_users,
            access.smeta,
            access.region,
            access.role,
            access.users,
            access.shartnoma,
            access.jur3,
            access.jur4
        FROM access
        JOIN users ON access.user_id = users.id
        JOIN regions ON regions.id = users.region_id
        WHERE regions.id = $1 AND access.id = $2
    `, [region_id, access_id])
    return access.rows[0]
})

const updateAccessDB = handleServiceError(async (object) => {
    await pool.query(`
        UPDATE access SET   
            kassa = $1,
            bank = $2,
            spravochnik = $3,
            organization = $4,
            region_users = $5,
            smeta = $6,
            region = $7,
            role = $8,
            users = $9,
            shartnoma = $10,
            jur3 = $11,
            jur4 = $12
        WHERE id = $13
    `, [
        object.kassa,
        object.bank,
        object.spravochnik,
        object.organization,
        object.region_users,
        object.smeta,
        object.region,
        object.role,
        object.users,
        object.shartnoma,
        object.jur3,
        object.jur4,
        object.access_id
    ])
})



module.exports = {
    createAccess,
    getByRoleIdAccessDB,
    getByIdAccessDB,
    updateAccessDB
}