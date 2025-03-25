
const { returnParamsValues } = require('@helper/functions')
const { db } = require('@db/index')

exports.AccessDB = class {
    static async createAccess(params, client) {
        const values = returnParamsValues(params, 4);
        const query = `INSERT INTO access (role_id, region_id, created_at, updated_at) VALUES ${values}`;
        const result = await client.query(query, params);
        return result;
    }

    static async deleteAccess(params, client) {
        const query = `UPDATE access SET isdeleted = true WHERE role_id = $1`;
        await client.query(query, params)
    }

    static async getByRoleIdAccess(params, region_id) {
        let index_region_id;
        if(region_id){
            params.push(region_id)
            index_region_id = params.length;
        }
        const query = `--sql
            SELECT 
                a.id,
                a.role_id,
                r.name AS role_name,
                a.region_id,
                a.region,
                a.role,
                a.users,
                a.budjet,
                a.access,
                a.spravochnik,
                a.smeta,
                a.smeta_grafik,
                a.bank,
                a.kassa,
                a.shartnoma,
                a.jur3,
                a.jur152,
                a.jur4,
                a.region_users,
                a.podotchet_monitoring,
                a.organization_monitoring,
                a.jur7
            FROM access AS a
            JOIN role AS r ON r.id = a.role_id
            WHERE r.id = $1 ${ region_id ? `AND a.region_id = $${index_region_id}` : ""} 
        `;
        const data = await db.query(query, params)
        return data[0];
    }

    static async getByIdAccess(params, isdeleted) {
        const query = `SELECT * FROM access WHERE region_id = $1 AND access.id = $2`;
        const data = await db.query(query, params)
        return data[0];
    }

    static async updateAccess(params) {
        const query = `--sql
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
                jur4 = $12,
                podotchet_monitoring = $13,
                budjet = $14,
                access = $15,
                smeta_grafik = $16,
                jur152 = $17,
                jur7 = $18,
                updated_at = $19
            WHERE id = $20
            RETURNING *
        `;
        const data = await db.query(query, params)
        return data[0];
    }
}