const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getAllMonitoring = handleServiceError(async (region_id, main_schet_id) => {
    const result = await pool.query(`
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
    
        ORDER BY combined_date DESC
    `, [region_id, main_schet_id]);
    
    let prixod_sum = 0
    let rasxod_sum = 0
    result.rows.forEach(item => {
        const prixod = Number(item.prixod_sum)
        const rasxod = Number(item.rasxod_sum)
        if(!prixod){
            rasxod_sum += rasxod
        }
        if(!rasxod){
            prixod_sum += prixod
        }
    })

    return {
        rows: result.rows.map(row => ({
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
        })),
        total_sum: prixod_sum - rasxod_sum,
        prixod_sum,
        rasxod_sum
    };
});

const getAllByFromMonitoring =  handleServiceError(async (region_id, main_schet_id, from) => {
    const result = await pool.query(`
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
        WHERE regions.id = $1 AND bank_prixod.main_schet_id = $2 AND bank_prixod.isdeleted = false AND bank_prixod.doc_date > $3
    
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
        WHERE regions.id = $1 AND bank_rasxod.main_schet_id = $2 AND bank_rasxod.isdeleted = false AND bank_rasxod.doc_date > $3
    
        ORDER BY combined_date DESC
    `, [region_id, main_schet_id, from]);
    
    let prixod_sum = 0
    let rasxod_sum = 0
    result.rows.forEach(item => {
        const prixod = Number(item.prixod_sum)
        const rasxod = Number(item.rasxod_sum)
        if(!prixod){
            rasxod_sum += rasxod
        }
        if(!rasxod){
            prixod_sum += prixod
        }
    })

    return {
        rows: result.rows.map(row => ({
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
        })),
        total_sum: prixod_sum - rasxod_sum,
        prixod_sum,
        rasxod_sum
    };
});

const getAllByToMonitoring =  handleServiceError(async (region_id, main_schet_id, to) => {
    const result = await pool.query(`
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
        WHERE regions.id = $1 AND bank_prixod.main_schet_id = $2 AND bank_prixod.isdeleted = false AND bank_prixod.doc_date < $3
    
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
        WHERE regions.id = $1 AND bank_rasxod.main_schet_id = $2 AND bank_rasxod.isdeleted = false AND bank_rasxod.doc_date < $3
    
        ORDER BY combined_date DESC
    `, [region_id, main_schet_id, to]);
    
    let prixod_sum = 0
    let rasxod_sum = 0
    result.rows.forEach(item => {
        const prixod = Number(item.prixod_sum)
        const rasxod = Number(item.rasxod_sum)
        if(!prixod){
            rasxod_sum += rasxod
        }
        if(!rasxod){
            prixod_sum += prixod
        }
    })

    return {
        rows: result.rows.map(row => ({
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
        })),
        total_sum: prixod_sum - rasxod_sum,
        prixod_sum,
        rasxod_sum
    };
});

const getAllByFromAndToMonitoring = handleServiceError(async (region_id, main_schet_id) => {
    const result = await pool.query(`
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
        WHERE regions.id = $1 AND bank_prixod.main_schet_id = $2 AND bank_prixod.isdeleted = false AND bank_prixod.doc_date BETWEEN $3 AND $4
    
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
        WHERE regions.id = $1 AND bank_rasxod.main_schet_id = $2 AND bank_rasxod.isdeleted = false AND bank_rasxod.doc_date BETWEEN $3 AND $4
    
        ORDER BY combined_date DESC
    `, [region_id, main_schet_id, from, to]);
    
    let prixod_sum = 0
    let rasxod_sum = 0
    result.rows.forEach(item => {
        const prixod = Number(item.prixod_sum)
        const rasxod = Number(item.rasxod_sum)
        if(!prixod){
            rasxod_sum += rasxod
        }
        if(!rasxod){
            prixod_sum += prixod
        }
    })

    return {
        rows: result.rows.map(row => ({
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
        })),
        total_sum: prixod_sum - rasxod_sum,
        prixod_sum,
        rasxod_sum
    };
});

module.exports = {
    getAllMonitoring,
    getAllByFromAndToMonitoring,
    getAllByFromMonitoring,
    getAllByToMonitoring
}
