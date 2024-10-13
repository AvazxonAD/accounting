const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");


const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to, spravochnik_organization_id) => {
    try {
        const filter = `sh_o.isdeleted = false AND r.id = $1 AND sh_o.main_schet_id = $2 AND sh_o.doc_date BETWEEN $3 AND $4 AND sh_o.spravochnik_organization_id = $7`
        const operatsi_filter = `isdeleted = false AND id_spravochnik_organization = $7`
        const { rows } = await pool.query(
            `
                WITH data AS (
                    SELECT 
                        sh_o.id,
                        sh_o.spravochnik_organization_id,
                        sh_o.doc_num,
                        TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
                        sh_o.smeta_id,
                        sh_o.smeta2_id,
                        sh_o.opisanie,
                        sh_o.summa,
                        sh_o.pudratchi_bool,
                        smeta.smeta_number,
                        (SELECT 
                            (SELECT ARRAY_AGG(row_to_json(operatsii))
                                FROM (SELECT 
                                        id,
                                        id_shartnomalar_organization AS shartnoma_id,
                                        doc_num,
                                        doc_date,
                                        opisanie,
                                        0 AS summa_rasxod, 
                                        summa AS summa_prixod
                                    FROM bank_rasxod 
                                    WHERE ${operatsi_filter} AND id_shartnomalar_organization = sh_o.id
                                    UNION ALL 
                                    SELECT 
                                        id,
                                        shartnomalar_organization_id AS shartnoma_id,
                                        doc_num,
                                        doc_date,
                                        opisanie,
                                        summa AS summa_rasxod,  
                                        0 AS summa_prixod
                                    FROM bajarilgan_ishlar_jur3 
                                    WHERE ${operatsi_filter} AND shartnomalar_organization_id = sh_o.id
                                    UNION ALL 
                                    SELECT 
                                        id,
                                        id_shartnomalar_organization AS shartnoma_id,
                                        doc_num,
                                        doc_date,
                                        opisanie,
                                        summa AS summa_rasxod, 
                                        0 AS summa_prixod
                                    FROM bank_prixod
                                    WHERE ${operatsi_filter} AND id_shartnomalar_organization = sh_o.id
                                    UNION ALL
                                    SELECT 
                                        id,
                                        shartnomalar_organization_id AS shartnoma_id,
                                        doc_num,
                                        doc_date,
                                        opisanie,
                                        0 AS summa_rasxod, 
                                        summa AS summa_prixod
                                    FROM kursatilgan_hizmatlar_jur152 
                                    WHERE ${operatsi_filter} AND shartnomalar_organization_id = sh_o.id
                                ) AS operatsii
                            ) 
                        ) AS array
                    FROM shartnomalar_organization AS sh_o
                    JOIN users AS u ON sh_o.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN smeta ON sh_o.smeta_id = smeta.id
                    WHERE ${filter}
                    ORDER BY sh_o.doc_date 
                    OFFSET $5 
                    LIMIT $6
                    ) 
                    SELECT 
                        ARRAY_AGG(row_to_json(data)) AS data,
                        COALESCE((SELECT COUNT(sh_o.id)
                            FROM shartnomalar_organization AS sh_o
                            JOIN users AS u ON sh_o.user_id = u.id
                            JOIN regions AS r ON u.region_id = r.id
                            JOIN smeta ON sh_o.smeta_id = smeta.id
                            WHERE ${filter}), 0)::INTEGER AS total_count,
                        (COALESCE((
                            SELECT SUM(k_h_j152.summa) 
                            FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = k_h_j152.shartnomalar_organization_id
                            WHERE k_h_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_r.summa) 
                            FROM bank_rasxod AS b_r
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_r.id_shartnomalar_organization
                            WHERE b_r.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_from_prixod,
                        (COALESCE((
                            SELECT SUM(b_i_j152.summa) 
                            FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_i_j152.shartnomalar_organization_id
                            WHERE b_i_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_p.summa) 
                            FROM bank_prixod AS b_p
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_p.id_shartnomalar_organization
                            WHERE b_p.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_from_rasxod,
                        (COALESCE((
                            SELECT SUM(k_h_j152.summa) 
                            FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = k_h_j152.shartnomalar_organization_id
                            WHERE k_h_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_r.summa) 
                            FROM bank_rasxod AS b_r
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_r.id_shartnomalar_organization
                            WHERE b_r.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_to_prixod,
                        (COALESCE((
                            SELECT SUM(b_i_j152.summa) 
                            FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_i_j152.shartnomalar_organization_id
                            WHERE b_i_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_p.summa) 
                            FROM bank_prixod AS b_p
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_p.id_shartnomalar_organization
                            WHERE b_p.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_to_rasxod
                    FROM data
            `, [region_id, main_schet_id, from, to, offset, limit, spravochnik_organization_id],
        );
        const data = rows[0].data?.map(obj => {
            let summa_prixod = 0;
            let summa_rasxod = 0; 
            obj.array.forEach(item => { 
                summa_rasxod += item.summa_rasxod; 
                summa_prixod += item.summa_prixod; 
            });
            obj.summa_rasxod = summa_rasxod;
            obj.summa_prixod = summa_prixod;
            return obj;
        });
        return {
            data: data || [],
            total: rows[0].total_count,
            summa_from_prixod: rows[0].summa_from_prixod,
            summa_from_rasxod: rows[0].summa_from_rasxod,
            summa_to_prixod: rows[0].summa_to_prixod,
            summa_to_rasxod: rows[0].summa_to_rasxod,
        };
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

module.exports = {
    getAllMonitoring,
};
