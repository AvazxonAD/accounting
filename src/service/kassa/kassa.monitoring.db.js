const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const { returnLocalDate } = require('../../utils/date.function');

const getAllMonitoring = handleServiceError(async (region_id, main_schet_id, offset, limit, from, to) => {
    const params = [region_id, main_schet_id, from, to];

    // Asosiy so'rov
    const baseQuery = `
        SELECT 
            kassa_prixod.id, 
            kassa_prixod.doc_num,
            kassa_prixod.doc_date,
            kassa_prixod.summa AS prixod_sum,
            0 AS rasxod_sum,
            kassa_prixod.spravochnik_operatsii_own_id, -- , ni qo'shgan
            kassa_prixod.id_podotchet_litso,
            spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name,
            kassa_prixod.opisaine,
            kassa_prixod.doc_date AS combined_date
        FROM kassa_prixod
        JOIN users ON kassa_prixod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN spravochnik_podotchet_litso ON kassa_prixod.id_podotchet_litso = spravochnik_podotchet_litso.id
        WHERE regions.id = $1 AND kassa_prixod.main_schet_id = $2 AND kassa_prixod.isdeleted = false
        AND kassa_prixod.doc_date BETWEEN $3 AND $4
    `;

    const secondPart = `
        UNION ALL
        SELECT 
            kassa_rasxod.id, 
            kassa_rasxod.doc_num,
            kassa_rasxod.doc_date,
            0 AS prixod_sum,
            kassa_rasxod.summa AS rasxod_sum,
            kassa_rasxod.spravochnik_operatsii_own_id,
            kassa_rasxod.id_podotchet_litso,
            spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name,
            kassa_rasxod.opisaine,
            kassa_rasxod.doc_date AS combined_date
        FROM kassa_rasxod
        JOIN users ON kassa_rasxod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN spravochnik_podotchet_litso ON kassa_rasxod.id_podotchet_litso = spravochnik_podotchet_litso.id
        WHERE regions.id = $1 AND kassa_rasxod.main_schet_id = $2 AND kassa_rasxod.isdeleted = false
        AND kassa_rasxod.doc_date BETWEEN $3 AND $4
    `;

    const finalQuery = baseQuery + secondPart + ` ORDER BY combined_date DESC OFFSET $${params.length + 1} LIMIT $${params.length + 2}`;
    params.push(offset, limit);

    const result = await pool.query(finalQuery, params);

    // Umumiy hisob
    const totalQuery = `
        SELECT 
            COUNT(*) AS total_count,
            (SELECT COALESCE(SUM(summa), 0) FROM kassa_prixod 
             WHERE main_schet_id = $2 AND isdeleted = false
             AND doc_date BETWEEN $3 AND $4) AS all_prixod_sum,
            (SELECT COALESCE(SUM(summa), 0) FROM kassa_rasxod 
             WHERE main_schet_id = $2 AND isdeleted = false
             AND doc_date BETWEEN $3 AND $4) AS all_rasxod_sum
        FROM (
            SELECT kassa_rasxod.id
            FROM kassa_rasxod
            JOIN users ON kassa_rasxod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 AND kassa_rasxod.main_schet_id = $2 AND kassa_rasxod.isdeleted = false
            AND kassa_rasxod.doc_date BETWEEN $3 AND $4
        ) AS combined_counts
    `;

    const totalQueryParams = [region_id, main_schet_id, from, to];
    const totalResult = await pool.query(totalQuery, totalQueryParams);

    const totalSumQuery = `
        SELECT 
        COALESCE((SELECT SUM(kassa_prixod.summa) 
                FROM kassa_prixod
                JOIN users ON kassa_prixod.user_id = users.id
                JOIN regions ON users.region_id = regions.id
                WHERE regions.id = $1 AND kassa_prixod.main_schet_id = $2 
                AND kassa_prixod.isdeleted = false
                AND kassa_prixod.doc_date <= $3), 0) -
        COALESCE((SELECT SUM(kassa_rasxod.summa) 
                FROM kassa_rasxod
                JOIN users ON kassa_rasxod.user_id = users.id
                JOIN regions ON users.region_id = regions.id
                WHERE regions.id = $1 AND kassa_rasxod.main_schet_id = $2 
                AND kassa_rasxod.isdeleted = false
                AND kassa_rasxod.doc_date <= $3), 0) AS total_sum
    `;

    const fromSumParams = [region_id, main_schet_id, from];
    const summaFrom = await pool.query(totalSumQuery, fromSumParams);

    const toSumParams = [region_id, main_schet_id, to];
    const summaTo = await pool.query(totalSumQuery, toSumParams);

    const data = result.rows.map(row => ({
        id: row.id,
        doc_num: row.doc_num,
        doc_date: row.doc_date,
        prixod_sum: Number(row.prixod_sum),
        rasxod_sum: Number(row.rasxod_sum),
        id_spravochnik_organization: row.id_spravochnik_organization,
        spravochnik_organization_name: row.spravochnik_organization_name,
        spravochnik_organization_raschet_schet: row.spravochnik_organization_raschet_schet,
        spravochnik_organization_inn: row.spravochnik_organization_inn,
        shartnomalar_doc_num: row.shartnomalar_doc_num,
        shartnomalar_doc_date: row.shartnomalar_doc_date,
        opisaine: row.opisaine
    }));

    return {
        rows: data,
        total: {
            total_count: Number(totalResult.rows[0].total_count),
            all_prixod_sum: Number(totalResult.rows[0].all_prixod_sum),
            all_rasxod_sum: Number(totalResult.rows[0].all_rasxod_sum),
            summaFrom: summaFrom.rows[0],
            summaTo: summaTo.rows[0]
        }
    };
});

module.exports = {
    getAllMonitoring,
};
