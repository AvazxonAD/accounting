const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const { tashkentTime } = require('../../utils/date.function');

const groupCreateService = async (data) => {
    try {
        const result = await pool.query(`
            INSERT INTO group_jur7 (
                pereotsenka_jur7_id, 
                user_id, 
                name, 
                schet, 
                iznos_foiz, 
                provodka_debet, 
                provodka_subschet, 
                provodka_kredit, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [
                data.pereotsenka_jur7_id,
                data.user_id,
                data.name,
                data.schet,
                data.iznos_foiz,
                data.provodka_debet,
                data.provodka_subschet,
                data.provodka_kredit,
                tashkentTime(),
                tashkentTime()
            ]
        );
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getGroupService = async (region_id, offset, limit) => {
    try {
        const { rows } = await pool.query(`
            WITH data AS (
                SELECT 
                    g_j7.id, 
                    g_j7.pereotsenka_jur7_id,
                    g_j7.name, 
                    g_j7.schet, 
                    g_j7.iznos_foiz, 
                    g_j7.provodka_debet, 
                    g_j7.provodka_subschet, 
                    g_j7.provodka_kredit
                FROM group_jur7 AS g_j7
                JOIN users AS u ON u.id = g_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE g_j7.isdeleted = false AND r.id = $3 
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(g_j7.id), 0)::INTEGER 
                    FROM group_jur7 AS g_j7
                    JOIN users AS u ON u.id = g_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE g_j7.isdeleted = false AND r.id = $3 
                ) AS total_count
            FROM data
        `, [offset, limit, region_id]);
        return { data: rows[0]?.data || [], total: rows[0].total_count };
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByIdGroupService = async (id, region_id, ignore_ideleted = false) => {
    try {
        let ignore = '';
        if (!ignore_ideleted) {
            ignore = 'AND g_j7.isdeleted = false';
        }
        const result = await pool.query(`
            SELECT 
                g_j7.id, 
                g_j7.pereotsenka_jur7_id,
                g_j7.name, 
                g_j7.schet, 
                g_j7.iznos_foiz, 
                g_j7.provodka_debet, 
                g_j7.provodka_subschet, 
                g_j7.provodka_kredit
            FROM group_jur7 AS g_j7
            JOIN users AS u ON u.id = g_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE g_j7.id = $1 AND r.id = $2 ${ignore}`, [id, region_id]);
        if (!result.rows[0]) {
            throw new ErrorResponse('doc not found', 404);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode);
    }
};

const updateGroupService = async (data) => {
    try {
        const result = await pool.query(`
            UPDATE group_jur7
            SET 
                pereotsenka_jur7_id = $1,
                name = $2,
                schet = $3,
                iznos_foiz = $4,
                provodka_debet = $5,
                provodka_subschet = $6,
                provodka_kredit = $7,
                updated_at = $8
            WHERE id = $9 AND isdeleted = false 
            RETURNING *
        `, [
            data.pereotsenka_jur7_id,
            data.name,
            data.schet,
            data.iznos_foiz,
            data.provodka_debet,
            data.provodka_subschet,
            data.provodka_kredit,
            tashkentTime(),
            data.id
        ]);
        if (!result.rows[0]) {
            throw new ErrorResponse('doc not found', 404);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode);
    }
};

const deleteGroupService = async (id) => {
    await  pool.query(`UPDATE group_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, [id])
}

module.exports = {
    groupCreateService,
    getGroupService,
    getByIdGroupService,
    updateGroupService,
    deleteGroupService
}