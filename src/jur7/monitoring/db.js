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

    static async getSummaReport(params, operator) {
        let internal_filter = ``;
        if(params.length === 3){
            internal_filter = `${operator} $3`
        }
        if(params.length === 4) {
            internal_filter = 'BETWEEN $3 AND $4'
        }

        const query = `--sql
            WITH 
            jur7_prixodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0) AS summa
                FROM document_prixod_jur7 d_j
                JOIN document_prixod_jur7_child d_j_ch ON d_j_ch.document_prixod_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ${internal_filter}
            ),
            jur7_rasxodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0) AS summa
                FROM document_rasxod_jur7 d_j
                JOIN document_rasxod_jur7_child d_j_ch ON d_j_ch.document_rasxod_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ${internal_filter}
            ),
            jur7_internal_rasxodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0) AS summa
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ${internal_filter}
            ),
            jur7_internal_PrixodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0) AS summa
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ${internal_filter}
            )
            SELECT 
                ((jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) - (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa)) AS summa,
                (jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) AS prixod,
                (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa) AS rasxod
            FROM jur7_prixodSum, jur7_rasxodSum, jur7_internal_rasxodSum, jur7_internal_PrixodSum
        `;
        const result = await db.query(query, params)
        return result[0]
    }
}