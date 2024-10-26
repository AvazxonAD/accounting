const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { tashkentTime } = require('../utils/date.function');

const podrazdelenieCreateService = async (data) => {
    try {
        const result = await pool.query(`
            INSERT INTO spravochnik_podrazdelenie_jur7 (
                user_id, 
                name, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [
                data.user_id,
                data.name,
                tashkentTime(),
                tashkentTime()
            ]
        );
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
}

const getpodrazdelenieService = async (region_id, offset, limit) => {
    try {
        const { rows } = await pool.query(`
            WITH data AS (
                SELECT 
                    s_p_j7.id, 
                    s_p_j7.name
                FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
                JOIN users AS u ON u.id = s_p_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE s_p_j7.isdeleted = false AND r.id = $3 
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(s_p_j7.id), 0)::INTEGER 
                    FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
                    JOIN users AS u ON u.id = s_p_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE s_p_j7.isdeleted = false AND r.id = $3 
                ) AS total_count
            FROM data
        `, [offset, limit, region_id]);

        return { data: rows[0]?.data || [], total: rows[0]?.total_count || 0 };
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const getByNamePodrazdelenieService = async (region_id, name) => {
    try {
        const result = await pool.query(`
            SELECT s_p_j7.*
            FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
            JOIN users AS u ON u.id = s_p_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE s_p_j7.name = $1 AND r.id = $2 AND s_p_j7.isdeleted = false
        `, [name, region_id]);

        if (result.rows[0]) {
            throw new ErrorResponse('This data already entered', 409);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const getByIdpodrazdelenieService = async (region_id, id, ignore_ideleted = false) => {
    try {
        let ignore = '';
        if (!ignore_ideleted) {
            ignore = 'AND s_p_j7.isdeleted = false';
        }
        const result = await pool.query(`
            SELECT 
                s_p_j7.id, 
                s_p_j7.name
            FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
            JOIN users AS u ON u.id = s_p_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE s_p_j7.id = $1 AND r.id = $2 ${ignore}
        `, [id, region_id]);
        if (!result.rows[0]) {
            throw new ErrorResponse('podrazdelenie not found', 404);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const updatepodrazdelenieService = async (data) => {
    try {
        const result = await pool.query(`
            UPDATE spravochnik_podrazdelenie_jur7 SET name = $1, updated_at = $2
            WHERE id = $3 AND isdeleted = false 
            RETURNING *
        `, [ data.name, tashkentTime(), data.id ]);
        if (!result.rows[0]) {
            throw new ErrorResponse('doc not found', 404);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};


const deletepodrazdelenieService = async (id) => {
    await  pool.query(`UPDATE spravochnik_podrazdelenie_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, [id])
}

module.exports = {
    podrazdelenieCreateService,
    getpodrazdelenieService,
    getByIdpodrazdelenieService,
    updatepodrazdelenieService,
    deletepodrazdelenieService,
    getByNamePodrazdelenieService
}