const { db } = require('../../db/index');

exports.Monitoringjur7DB = class {
    static async getSchets(params) {
        const query = `--sql
            SELECT schet 
            FROM (
                SELECT d_j_ch.debet_schet AS schet
                FROM document_prixod_jur7 d_j
                JOIN document_prixod_jur7_child d_j_ch ON d_j_ch.document_prixod_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3
                
                UNION ALL
                
                SELECT d_j_ch.kredit_schet AS schet
                FROM document_rasxod_jur7 d_j
                JOIN document_rasxod_jur7_child d_j_ch ON d_j_ch.document_rasxod_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3
                
                UNION ALL
                
                SELECT d_j_ch.kredit_schet AS schet
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3
                
                UNION ALL
                
                SELECT d_j_ch.debet_schet AS schet
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3
            ) AS combined_schets
            GROUP BY schet   
        `;
        const result = await db.query(query, params)
        return result;
    }

    sta
}