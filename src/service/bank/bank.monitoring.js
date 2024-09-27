const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getAllMonitoring = handleServiceError(async (region_id, main_schet_id, offset, limit, from, to) => {
    const queryParts = [];
    const params = [region_id, main_schet_id];

    const baseQuery = `
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
    `;

    queryParts.push(baseQuery);

    if (from) {
        queryParts.push(` AND bank_prixod.doc_date > $${params.length + 1}`);
        params.push(from);
    }

    if (to) {
        queryParts.push(` AND bank_prixod.doc_date < $${params.length + 1}`);
        params.push(to);
    }

    const secondPart = `
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
    `;

    queryParts.push(secondPart);

    if (from) {
        queryParts.push(` AND bank_rasxod.doc_date > $${params.length + 1}`);
        params.push(from);
    }

    if (to) {
        queryParts.push(` AND bank_rasxod.doc_date < $${params.length + 1}`);
        params.push(to);
    }

    const finalQuery = queryParts.join(' ');

    const result = await pool.query(`${finalQuery} ORDER BY combined_date DESC OFFSET $${params.length + 1} LIMIT $${params.length + 2}`, [...params, offset, limit]);

    const totalQueryParams = [region_id, main_schet_id];
    
    let totalQueryBase = `
        SELECT 
            COUNT(*) AS total_count,
            (SELECT COALESCE(SUM(summa), 0) FROM bank_prixod 
             WHERE main_schet_id = $2 AND isdeleted = false
             ${from ? 'AND doc_date > $3' : ''} 
             ${to ? 'AND doc_date < $4' : ''}) AS all_prixod_sum,
            (SELECT COALESCE(SUM(summa), 0) FROM bank_rasxod 
             WHERE main_schet_id = $2 AND isdeleted = false
             ${from ? 'AND doc_date > $3' : ''} 
             ${to ? 'AND doc_date < $4' : ''}) AS all_rasxod_sum
        FROM (
            SELECT bank_rasxod.id
            FROM bank_rasxod
            JOIN users ON bank_rasxod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 AND bank_rasxod.main_schet_id = $2 AND bank_rasxod.isdeleted = false
    `;
    
    if (from) {
        totalQueryBase += ` AND bank_rasxod.doc_date > $${totalQueryParams.length + 1}`;
        totalQueryParams.push(from);
    }
    
    if (to) {
        totalQueryBase += ` AND bank_rasxod.doc_date < $${totalQueryParams.length + 1}`;
        totalQueryParams.push(to);
    }

    let totalQueryPart1 = totalQueryBase + `
            UNION ALL
            SELECT bank_prixod.id
            FROM bank_prixod
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 AND bank_prixod.main_schet_id = $2 AND bank_prixod.isdeleted = false
    `;

    if (from) {
        totalQueryPart1 += ` AND bank_prixod.doc_date > $${totalQueryParams.length + 1}`;
        totalQueryParams.push(from);
    }
    
    if (to) {
        totalQueryPart1 += ` AND bank_prixod.doc_date < $${totalQueryParams.length + 1}`;
        totalQueryParams.push(to);
    }

    totalQueryPart1 += `) AS combined_counts`;

    const totalQuery = await pool.query(totalQueryPart1, totalQueryParams);

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
        opisanie: row.opisanie
    }));

    return { 
        rows: data, 
        total: {
            total_count: Number(totalQuery.rows[0].total_count),
            all_prixod_sum: Number(totalQuery.rows[0].all_prixod_sum),
            all_rasxod_sum: Number(totalQuery.rows[0].all_rasxod_sum),
        }
    };
});

module.exports = {
    getAllMonitoring,
};
