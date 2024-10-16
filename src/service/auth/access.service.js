const pool = require("../../config/db");
const ErrorResponse = require('../../utils/errorResponse')

const createAccessService = async (role_id, region_id) => {
    try {
        const result = await pool.query(`INSERT INTO access (role_id, region_id) VALUES($1, $2) RETURNING *`, [role_id, region_id])
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByRoleIdAccessService = async (region_id, role_id) => {
    try {
        const access = await pool.query(`
            SELECT 
                access.id,
                access.role_id,
                access.region_id,
                access.region,
                access.role,
                access.users,
                access.budjet,
                access.access,
                access.spravochnik,
                access.smeta,
                access.smeta_grafik,
                access.bank,
                access.kassa,
                access.shartnoma,
                access.jur3,
                access.jur152,
                access.jur4,
                access.region_users,
                access.podotchet_monitoring,
                access.organization_monitoring
            FROM access
            JOIN role ON role.id = access.role_id
            WHERE region_id = $1 AND role.id = $2
        `, [region_id, role_id])
        return access.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByIdAccessService = async (region_id, access_id, role_id) => {
    try {
        const access = await pool.query(`
            SELECT id FROM access WHERE region_id = $1 AND access.id = $2 AND role_id = $3`, [region_id, access_id, role_id])
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
                organization_monitoring = $4,
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
            object.organization_monitoring,
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