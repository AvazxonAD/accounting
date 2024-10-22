const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const { tashkentTime } = require('../../utils/date.function');

const createNaimenovanieService = async (data) => {
    try {
        const result = await pool.query(`
            INSERT INTO naimenovanie_tovarov_jur7 (
                user_id, 
                spravochnik_budjet_name_id, 
                name, 
                edin, 
                group_jur7_id, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [
                data.user_id,
                data.spravochnik_budjet_name_id,
                data.name,
                data.edin,
                data.group_jur7_id,
                tashkentTime(),
                tashkentTime()
            ]
        );
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const getAllNaimenovanieService = async (region_id, offset, limit) => {
    try {
        const { rows } = await pool.query(`
            WITH data AS (
                SELECT 
                    n_t_j7.id, 
                    n_t_j7.name, 
                    n_t_j7.edin,
                    n_t_j7.group_jur7_id,
                    n_t_j7.spravochnik_budjet_name_id
                FROM naimenovanie_tovarov_jur7 AS n_t_j7
                JOIN users AS u ON u.id = n_t_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE n_t_j7.isdeleted = false AND r.id = $3
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(n_t_j7.id), 0)::INTEGER 
                    FROM naimenovanie_tovarov_jur7 AS n_t_j7
                    JOIN users AS u ON u.id = n_t_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE n_t_j7.isdeleted = false AND r.id = $3
                ) AS total_count
            FROM data
        `, [offset, limit, region_id]);

        return { data: rows[0]?.data || [], total: rows[0]?.total_count || 0 };
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const getByIdNaimenovanieService = async (region_id, id, ignore_deleted = false) => {
    try {
        let ignore = ``
        if(!ignore_deleted){
            ignore = ` AND n_t_j7.isdeleted = false`
        }
        const result = await pool.query(`
            SELECT 
                n_t_j7.id, 
                n_t_j7.name, 
                n_t_j7.edin,
                n_t_j7.group_jur7_id,
                n_t_j7.spravochnik_budjet_name_id
            FROM naimenovanie_tovarov_jur7 AS n_t_j7
            JOIN users AS u ON u.id = n_t_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $2 AND n_t_j7.id = $1 ${ignore}                
        `, [id, region_id]);

        if (!result.rows[0]) {
            throw new ErrorResponse('naimenovanie not found', 404);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const updateNaimenovanieService = async (data) => {
    try {
        const result = await pool.query(`
            UPDATE naimenovanie_tovarov_jur7 
            SET name = $1, edin = $2, updated_at = $3, spravochnik_budjet_name_id = $4, group_jur7_id = $6
            WHERE id = $5 AND isdeleted = false
            RETURNING *
        `, [ data.name, data.edin, tashkentTime(), data.spravochnik_budjet_name_id, data.id, data.group_jur7_id ]);
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const deleteNaimenovanieService = async (id) => {
    await pool.query(` UPDATE naimenovanie_tovarov_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, [id]);
};

// Eksport qilish
module.exports = {
    createNaimenovanieService,
    getAllNaimenovanieService,
    getByIdNaimenovanieService,
    updateNaimenovanieService,
    deleteNaimenovanieService
};
