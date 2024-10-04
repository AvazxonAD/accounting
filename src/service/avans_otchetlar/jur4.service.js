const { handleServiceError } = require("../../middleware/service.handle");
const pool = require("../../config/db");

const createJur4DB = handleServiceError(async (data) => {
    const result = await pool.query(
        `
            INSERT INTO avans_otchetlar_jur4(
                doc_num, 
                doc_date, 
                opisanie, 
                summa,
                spravochnik_podotchet_litso_id, 
                main_schet_id, 
                user_id,
                spravochnik_operatsii_own_id,
                created_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
            `,
        [
            data.doc_num,
            data.doc_date,
            data.opisanie,
            data.summa,
            data.spravochnik_podotchet_litso_id,
            data.main_schet_id,
            data.user_id,
            data.spravochnik_operatsii_own_id,
            new Date()
        ],
    );
    return result.rows[0]
})

const createJur4ChildDB = handleServiceError(async (data) => {
    await pool.query(
        `
              INSERT INTO avans_otchetlar_jur4_child(
                  spravochnik_operatsii_id,
                  summa,
                  id_spravochnik_podrazdelenie,
                  id_spravochnik_sostav,
                  id_spravochnik_type_operatsii,
                  main_schet_id,
                  avans_otchetlar_jur4_id,
                  user_id,
                  spravochnik_operatsii_own_id,
                  created_at
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
            data.spravochnik_operatsii_id,
            data.summa,
            data.id_spravochnik_podrazdelenie,
            data.id_spravochnik_sostav,
            data.id_spravochnik_type_operatsii,
            data.main_schet_id,
            data.avans_otchetlar_jur4_id,
            data.user_id,
            data.spravochnik_operatsii_own_id,
            new Date()
        ],
    );
})

const getAllJur4DB = handleServiceError(async (region_id, main_schet_id, from, to, offset, limit) => {
    const results = await pool.query(
        ` SELECT 
            a_o_j_4.id, 
            a_o_j_4.doc_num, 
            TO_CHAR(a_o_j_4.doc_date, 'YYYY-MM-DD') AS doc_date, 
            a_o_j_4.opisanie, 
            a_o_j_4.summa::FLOAT, 
            a_o_j_4.spravochnik_podotchet_litso_id,
            s_p_l.name AS spravochnik_podotchet_litso_name,
            s_p_l.rayon AS spravochnik_podotchet_litso_rayon,
            a_o_j_4.spravochnik_operatsii_own_id
          FROM avans_otchetlar_jur4 AS a_o_j_4
          JOIN users AS u ON u.id =  a_o_j_4.user_id
          JOIN regions AS r ON u.region_id = r.id
          JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_o_j_4.spravochnik_podotchet_litso_id 
          WHERE a_o_j_4.main_schet_id = $1 
            AND r.id = $2 
            AND a_o_j_4.isdeleted = false
            AND a_o_j_4.doc_date BETWEEN $3 AND $4
          OFFSET $5
          LIMIT $6
        `,
        [main_schet_id, region_id, from, to, offset, limit],
    );

    const total = await pool.query(`
          SELECT COUNT(a_o_j_4.id)::INTEGER AS total
          FROM avans_otchetlar_jur4 AS a_o_j_4
          JOIN users AS u ON u.id =  a_o_j_4.user_id
          JOIN regions AS r ON u.region_id = r.id
          WHERE a_o_j_4.main_schet_id = $1 
            AND r.id = $2 
            AND a_o_j_4.doc_date BETWEEN $3 AND $4
    `, [main_schet_id, region_id, from, to])

    const summa = await pool.query(`
        SELECT SUM(a_o_j_4.summa)::FLOAT AS summa
        FROM avans_otchetlar_jur4 AS a_o_j_4
        JOIN users AS u ON u.id =  a_o_j_4.user_id
        JOIN regions AS r ON u.region_id = r.id
        WHERE a_o_j_4.main_schet_id = $1 
          AND r.id = $2 
          AND a_o_j_4.doc_date BETWEEN $3 AND $4
  `, [main_schet_id, region_id, from, to])

    return { rows: results.rows, total: total.rows[0].total, summa: summa.rows[0].summa }
})

const getAllJur4ChildDB = handleServiceError(async (region_id, main_schet_id, avans_otchetlar_jur4_id) => {
    const result = await pool.query(`
            SELECT  
                a_o_j_4_ch.id,
                a_o_j_4_ch.spravochnik_operatsii_id,
                s_o.name AS spravochnik_operatsii_name,
                a_o_j_4_ch.summa::FLOAT,
                a_o_j_4_ch.id_spravochnik_podrazdelenie,
                s_p.name AS spravochnik_podrazdelenie_name,
                a_o_j_4_ch.id_spravochnik_sostav,
                s_s.name AS spravochnik_sostav_name,
                a_o_j_4_ch.id_spravochnik_type_operatsii,
                s_t_o.name AS spravochnik_type_operatsii_name
            FROM  avans_otchetlar_jur4_child AS a_o_j_4_ch 
            JOIN users AS u ON u.id =  a_o_j_4_ch.user_id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_o ON s_o.id = a_o_j_4_ch.spravochnik_operatsii_id
            LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = a_o_j_4_ch.id_spravochnik_podrazdelenie
            LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = a_o_j_4_ch.id_spravochnik_sostav
            LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = a_o_j_4_ch.id_spravochnik_type_operatsii
            WHERE r.id = $1 
                AND a_o_j_4_ch.main_schet_id = $2 
                AND a_o_j_4_ch.avans_otchetlar_jur4_id = $3
    `, [region_id, main_schet_id, avans_otchetlar_jur4_id])
    return result.rows
})

const getByIdJur4DB = handleServiceError(async (region_id, main_schet_id, id, ignoreDeleted = false) => {
    let query = `
        SELECT 
            a_o_j_4.id, 
            a_o_j_4.doc_num, 
            TO_CHAR(a_o_j_4.doc_date, 'YYYY-MM-DD') AS doc_date, 
            a_o_j_4.opisanie, 
            a_o_j_4.summa::FLOAT, 
            a_o_j_4.spravochnik_podotchet_litso_id,
            s_p_l.name AS spravochnik_podotchet_litso_name,
            s_p_l.rayon AS spravochnik_podotchet_litso_rayon,
            a_o_j_4.spravochnik_operatsii_own_id
        FROM avans_otchetlar_jur4 AS a_o_j_4
        JOIN users AS u ON u.id = a_o_j_4.user_id
        JOIN regions AS r ON u.region_id = r.id
        JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_o_j_4.spravochnik_podotchet_litso_id 
        WHERE a_o_j_4.main_schet_id = $1 
            AND r.id = $2 
            AND a_o_j_4.id = $3
    `;

    if (!ignoreDeleted) {
        query += ` AND a_o_j_4.isdeleted = false`;
    }

    const result = await pool.query(query, [main_schet_id, region_id, id]);
    return result.rows[0];
});

const updateJur4DB = handleServiceError(async (data) => {
    await pool.query(
        `
            UPDATE avans_otchetlar_jur4 SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3, 
                summa = $4,
                spravochnik_podotchet_litso_id = $5, 
                spravochnik_operatsii_own_id = $6,
                updated_at = $7
            WHERE id = $8 
            `,
        [
            data.doc_num,
            data.doc_date,
            data.opisanie,
            data.summa,
            data.spravochnik_podotchet_litso_id,
            data.spravochnik_operatsii_own_id,
            new Date(),
            data.id
        ],
    );
})

const deleteJur4ChildDB = handleServiceError(async (id) => {
    await pool.query(`DELETE FROM avans_otchetlar_jur4_child WHERE avans_otchetlar_jur4_id = $1`, [id])
})

const deleteJur4DB = handleServiceError(async (id) => {
    await pool.query(`UPDATE avans_otchetlar_jur4 SET isdeleted = true WHERE id = $1`, [id])
    await pool.query(`UPDATE avans_otchetlar_jur4_child SET isdeleted = true WHERE avans_otchetlar_jur4_id = $1`, [id])
})

module.exports = {
    createJur4DB,
    createJur4ChildDB,
    getAllJur4DB,
    getAllJur4ChildDB,
    getByIdJur4DB,
    deleteJur4ChildDB,
    updateJur4DB,
    deleteJur4DB
}
