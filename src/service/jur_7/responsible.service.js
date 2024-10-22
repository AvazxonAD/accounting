const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const { tashkentTime } = require('../../utils/date.function');

const responsibleCreateService = async (data) => {
    try {
        const result = await pool.query(`
            INSERT INTO spravochnik_javobgar_shaxs_jur7 (
                spravochnik_podrazdelenie_jur7_id, 
                fio, 
                user_id, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [
                data.spravochnik_podrazdelenie_jur7_id,
                data.fio,
                data.user_id,
                tashkentTime(),
                tashkentTime()
            ]
        );
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const getResponsibleService = async (region_id, offset, limit) => {
    try {
        const { rows } = await pool.query(`
            WITH data AS (
                SELECT 
                    s_j_s_j7.id, 
                    s_j_s_j7.fio,
                    s_j_s_j7.spravochnik_podrazdelenie_jur7_id
                FROM spravochnik_javobgar_shaxs_jur7 AS s_j_s_j7
                JOIN users AS u ON u.id = s_j_s_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE s_j_s_j7.isdeleted = false AND r.id = $3 
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(s_j_s_j7.id), 0)::INTEGER 
                    FROM spravochnik_javobgar_shaxs_jur7 AS s_j_s_j7
                    JOIN users AS u ON u.id = s_j_s_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE s_j_s_j7.isdeleted = false AND r.id = $3 
                ) AS total_count
            FROM data
        `, [offset, limit, region_id]);

        return { data: rows[0]?.data || [], total: rows[0]?.total_count || 0 };
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const getByIdResponsibleService = async (id, region_id, ignore_ideleted = false) => {
    try {
        let ignore = '';
        if (!ignore_ideleted) {
            ignore = 'AND s_j_s_j7.isdeleted = false';
        }
        const result = await pool.query(`
            SELECT 
                s_j_s_j7.id, 
                s_j_s_j7.fio,
                s_j_s_j7.spravochnik_podrazdelenie_jur7_id
            FROM spravochnik_javobgar_shaxs_jur7 AS s_j_s_j7
            JOIN users AS u ON u.id = s_j_s_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE s_j_s_j7.id = $1 AND r.id = $2 ${ignore}
        `, [id, region_id]);

        if (!result.rows[0]) {
            throw new ErrorResponse('Javobgar shaxs not found', 404);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const updateResponsibleService = async (data) => {
    try {
        const result = await pool.query(`
            UPDATE spravochnik_javobgar_shaxs_jur7 SET fio = $1, updated_at = $2,  spravochnik_podrazdelenie_jur7_id = $4
            WHERE id = $3 AND isdeleted = false 
            RETURNING *
        `, [ data.fio, tashkentTime(), data.id, data.spravochnik_podrazdelenie_jur7_id ]);
        if (!result.rows[0]) {
            throw new ErrorResponse('doc not found', 404);
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const deleteResponsibleService = async (id) => {
    await  pool.query(`UPDATE spravochnik_javobgar_shaxs_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, [id])
};

module.exports = {
    responsibleCreateService,
    getResponsibleService,
    getByIdResponsibleService,
    updateResponsibleService,
    deleteResponsibleService
};
