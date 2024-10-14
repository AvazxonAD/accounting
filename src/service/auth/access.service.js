const pool = require("../../config/db");
const ErrorResponse = require('../../utils/errorResponse')

const createAccessService = async (role_id, user_id) => {
    try {
        const result = await pool.query(`INSERT INTO access (role_id, user_id) VALUES($1, $2) RETURNING *`, [role_id, user_id])
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByRoleIdAccessService = async (region_id, role_id) => {
    try {
        const access = await pool.query(`
            SELECT 
                access.id,
                access.kassa,
                access.bank,
                access.spravochnik,
                access.organization_monitoring,
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
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByIdAccessService = async (region_id, access_id) => {
    try {
        const access = await pool.query(`
            SELECT 
                access.id,
                access.kassa,
                access.bank,
                access.spravochnik,
                access.organization_monitoring,
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
        if(!access.rows[0]){
            throw new ErrorResponse('access not found', 404)
        }
        return access.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const updateAccessDB = async (object) => {
    try {
        const result = await pool.query(`
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
            RETURNING * 
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
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}



module.exports = {
    createAccessService,
    getByRoleIdAccessService,
    getByIdAccessService,
    updateAccessDB
}