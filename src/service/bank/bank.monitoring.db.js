const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const { returnLocalDate } = require('../../utils/date.function');

const getAllMonitoring = handleServiceError(async (region_id, main_schet_id, offset, limit, from, to) => {
    const params = [region_id, main_schet_id, from, to, offset, limit];


    const data = await pool.query(`
        SELECT 
            bank_prixod.id, 
            bank_prixod.doc_num,
            bank_prixod.doc_date,
            bank_prixod.summa AS prixod_sum,
            0 AS rasxod_sum,
            bank_prixod.id_spravochnik_organization,
            spravochnik_organization.name AS spravochnik_organization_name,
            spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
            spravochnik_organization.inn AS spravochnik_organization_inn,
            bank_prixod.id_shartnomalar_organization,
            shartnomalar_organization.doc_num AS shartnomalar_doc_num,
            shartnomalar_organization.doc_date AS shartnomalar_doc_date,
            bank_prixod.opisanie,
            bank_prixod.doc_date AS combined_date
        FROM bank_prixod
        JOIN users ON bank_prixod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN spravochnik_organization ON bank_prixod.id_spravochnik_organization = spravochnik_organization.id
        LEFT JOIN shartnomalar_organization ON bank_prixod.id_shartnomalar_organization = shartnomalar_organization.id
        WHERE regions.id = $1 AND bank_prixod.main_schet_id = $2 AND bank_prixod.isdeleted = false
        AND bank_prixod.doc_date BETWEEN $3 AND $4

        UNION ALL

        SELECT 
            bank_rasxod.id, 
            bank_rasxod.doc_num,
            bank_rasxod.doc_date,
            0 AS prixod_sum,
            bank_rasxod.summa AS rasxod_sum,
            bank_rasxod.id_spravochnik_organization,
            spravochnik_organization.name AS spravochnik_organization_name,
            spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
            spravochnik_organization.inn AS spravochnik_organization_inn,
            bank_rasxod.id_shartnomalar_organization,
            shartnomalar_organization.doc_num AS shartnomalar_doc_num,
            shartnomalar_organization.doc_date AS shartnomalar_doc_date,
            bank_rasxod.opisanie,
            bank_rasxod.doc_date AS combined_date
        FROM bank_rasxod
        JOIN users ON bank_rasxod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN spravochnik_organization ON bank_rasxod.id_spravochnik_organization = spravochnik_organization.id
        LEFT JOIN shartnomalar_organization ON bank_rasxod.id_shartnomalar_organization = shartnomalar_organization.id
        WHERE regions.id = $1 AND bank_rasxod.main_schet_id = $2 AND bank_rasxod.isdeleted = false
        AND bank_rasxod.doc_date BETWEEN $3 AND $4
        ORDER BY combined_date DESC
        OFFSET $5 LIMIT $6;
    `, params )


    const totalQuery = `
    SELECT COUNT(*) AS total_count, 
           COALESCE(SUM(bp.summa), 0) AS all_prixod_sum,
           COALESCE(SUM(br.summa), 0) AS all_rasxod_sum
    FROM (
        SELECT bp.summa
        FROM bank_prixod bp
        JOIN users u ON bp.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        WHERE r.id = $1 AND bp.main_schet_id = $2 
        AND bp.isdeleted = false
        AND bp.doc_date BETWEEN $3 AND $4

        UNION ALL 
        
        SELECT br.summa
        FROM bank_rasxod br
        JOIN users u ON br.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        WHERE r.id = $1 AND br.main_schet_id = $2 
        AND br.isdeleted = false
        AND br.doc_date BETWEEN $3 AND $4
    ) AS combined;
`;
    const totalResult = await pool.query(totalQuery, [region_id, main_schet_id, from, to]);

    const totalSumQuery = `
        SELECT 
        COALESCE((SELECT SUM(bank_prixod.summa) 
                FROM bank_prixod
                JOIN users ON bank_prixod.user_id = users.id
                JOIN regions ON users.region_id = regions.id
                WHERE regions.id = $1 AND bank_prixod.main_schet_id = $2 
                AND bank_prixod.isdeleted = false
                AND bank_prixod.doc_date <= $3), 0) - 
        COALESCE((SELECT SUM(bank_rasxod.summa) 
                FROM bank_rasxod
                JOIN users ON bank_rasxod.user_id = users.id
                JOIN regions ON users.region_id = regions.id
                WHERE regions.id = $1 AND bank_rasxod.main_schet_id = $2 
                AND bank_rasxod.isdeleted = false
                AND bank_rasxod.doc_date <= $3), 0) AS total_sum
    `;
    const fromSumParams = [region_id, main_schet_id, from];
    const summaFrom = await pool.query(totalSumQuery, fromSumParams);

    const toSumParams = [region_id, main_schet_id, to];
    const summaTo = await pool.query(totalSumQuery, toSumParams);

    const result_data = result.rows.map(row => ({
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
        opisanie: row.opisanie
    }));

    return {
        rows: result_data,
        total: {
            total_count: Number(totalResult.rows[0].total_count),
            all_prixod_sum: Number(totalResult.rows[0].all_prixod_sum),
            all_rasxod_sum: Number(totalResult.rows[0].all_rasxod_sum),
            summaFrom: summaFrom.rows[0].total_sum,
            summaTo: summaTo.rows[0].total_sum
        }
    };
});

module.exports = {
    getAllMonitoring,
};
