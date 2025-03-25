const { db } = require('@db/index');

exports.UnitDB = class {
    static async createUnit(params) {
        const query = `
            INSERT INTO storage_unit (
                name, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByIdUnit(params, isdeleted) {
        const query = `
            SELECT id, name 
            FROM storage_unit 
            WHERE id = $1 ${!isdeleted ? 'AND isdeleted = false' : ''}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getUnit() {
        const query = `
            SELECT id, name 
            FROM storage_unit 
            WHERE isdeleted = false
        `;
        const result = await db.query(query);
        return result;
    }

    static async getByNameUnit(params) {
        const query = `
            SELECT * 
            FROM storage_unit 
            WHERE name = $1 AND isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updateUnit(params) {
        const query = `
            UPDATE storage_unit 
            SET name = $1, updated_at = $2
            WHERE id = $3 AND isdeleted = false 
            RETURNING *
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteUnit(params) {
        const query = `
            UPDATE storage_unit 
            SET isdeleted = true 
            WHERE id = $1 AND isdeleted = false
        `;
        await db.query(query, params);
    }
}
