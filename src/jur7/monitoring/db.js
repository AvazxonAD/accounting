const { db } = require('../../db/index');
const { sqlFilter } = require('../../helper/functions')

exports.Monitoringjur7DB = class {
    static async getSchets(params, responsible_id = null) {
        let index_responsible_id = null;
        if (responsible_id) {
            params.push(responsible_id)
            index_responsible_id = params.length;
        }
        const query = `--sql
            SELECT schet 
            FROM (
                SELECT d_j_ch.debet_schet AS schet
                FROM document_prixod_jur7 d_j
                JOIN document_prixod_jur7_child d_j_ch ON d_j_ch.document_prixod_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3 
                ${responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : ''}
                UNION ALL
                
                SELECT d_j_ch.kredit_schet AS schet
                FROM document_rasxod_jur7 d_j
                JOIN document_rasxod_jur7_child d_j_ch ON d_j_ch.document_rasxod_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3
                ${responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : ''}
                
                UNION ALL
                
                SELECT d_j_ch.kredit_schet AS schet
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3
                ${responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : ''}
                
                UNION ALL
                
                SELECT d_j_ch.debet_schet AS schet
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3
                ${responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : ''}

            ) AS combined_schets
            GROUP BY schet   
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getSummaReport(params, operator, responsible_id = null, product_id = null) {
        let internal_filter = ``;
        if (params.length === 3) {
            internal_filter = `${operator} $3`
        }
        if (params.length === 4) {
            internal_filter = 'BETWEEN $3 AND $4'
        }
        let index_responsible_id = null;
        if (responsible_id) {
            params.push(responsible_id);
            index_responsible_id = params.length;
        }
        let product_filter = ``;
        if (product_id) {
            product_filter = `AND d_j_ch.naimenovanie_tovarov_jur7_id = $${params.length + 1}`;
            params.push(product_id);
        }

        const query = `--sql
            WITH 
            jur7_prixodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0::FLOAT) AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
                FROM document_prixod_jur7 d_j
                JOIN document_prixod_jur7_child d_j_ch ON d_j_ch.document_prixod_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ${internal_filter}
                ${responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : ''} ${product_filter} 
            ),
            jur7_rasxodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
                FROM document_rasxod_jur7 d_j
                JOIN document_rasxod_jur7_child d_j_ch ON d_j_ch.document_rasxod_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ${internal_filter}
                ${responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : ''} ${product_filter}
            ),
            jur7_internal_rasxodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ${internal_filter}
                ${responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : ''} ${product_filter}
            ),
            jur7_internal_PrixodSum AS (
                SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
                FROM document_vnutr_peremesh_jur7 d_j
                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                WHERE d_j.main_schet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ${internal_filter}
                ${responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : ''} ${product_filter}
            )
            SELECT 
                ((jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) - (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa)) AS summa,
                ((jur7_prixodSum.kol + jur7_internal_PrixodSum.kol) - (jur7_rasxodSum.kol + jur7_internal_rasxodSum.kol)) AS kol,
                (jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) AS prixod,
                (jur7_prixodSum.kol + jur7_internal_PrixodSum.kol) AS prixod_kol,
                (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa) AS rasxod,
                (jur7_rasxodSum.kol + jur7_internal_rasxodSum.kol) AS rasxod_kol
            FROM jur7_prixodSum, jur7_rasxodSum, jur7_internal_rasxodSum, jur7_internal_PrixodSum
        `;

        const result = await db.query(query, params)
        return result[0]
    }

    static async getBySchetProducts(params) {
        const query = `--sql
            SELECT 
              n.id,
              TO_CHAR(d_j.doc_date, 'YYYY-MM-DD') AS doc_date, 
              n.id, 
              n.edin,
              n.name
            FROM document_prixod_jur7  d_j
            JOIN users AS u ON u.id = d_j.user_id
            JOIN regions r ON r.id = u.region_id
            JOIN document_prixod_jur7_child d_ch ON d_ch.document_prixod_jur7_id = d_j.id
            JOIN naimenovanie_tovarov_jur7 n ON n.id = d_ch.naimenovanie_tovarov_jur7_id
            WHERE d_j.isdeleted = false 
              AND r.id = $1
              AND d_j.main_schet_id = $2
              AND d_ch.debet_schet = $3
              AND d_j.kimga_id = $4
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getSchetsForCap(params) {
        const query = `--sql
            SELECT DISTINCT debet_schet, kredit_schet 
            FROM (
                SELECT ch.debet_schet, ch.kredit_schet
                FROM document_rasxod_jur7 d
                JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id 
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE m.spravochnik_budjet_name_id = $1
                    AND r.id = $2
                    AND d.doc_date BETWEEN $3 AND $4
    
                UNION ALL
    
                SELECT ch.debet_schet, ch.kredit_schet
                FROM document_vnutr_peremesh_jur7 d
                JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id 
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE m.spravochnik_budjet_name_id = $1
                    AND r.id = $2
                    AND d.doc_date BETWEEN $3 AND $4
    
                UNION ALL 
    
                SELECT g.provodka_debet AS debet_schet, g.provodka_kredit AS kredit_schet
                FROM iznos_tovar_jur7 i
                JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id
                JOIN group_jur7 AS g ON g.id = p.group_jur7_id
                JOIN users AS u ON u.id = i.user_id 
                JOIN regions AS r ON r.id = u.region_id
                WHERE i.budjet_id = $1
                    AND r.id = $2
                    AND i.full_date BETWEEN $3 AND $4
            ); 
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getSchetSumma(params) {
        const query = `--sql
            SELECT COALESCE(SUM(summa_s_nds), 0)::FLOAt AS summa 
            FROM (
                SELECT ch.summa_s_nds, ch.debet_schet, ch.kredit_schet
            FROM document_rasxod_jur7 d
            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id 
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE m.spravochnik_budjet_name_id = $1
                AND  r.id = $2
                AND d.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT ch.summa_s_nds, ch.debet_schet, ch.kredit_schet
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id 
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE m.spravochnik_budjet_name_id = $1
                AND  r.id = $2
                AND d.doc_date BETWEEN $3 AND $4
            
            UNION ALL 

                SELECT  i.iznos_summa AS summa_s_nds, g.provodka_debet AS debet_schet, g.provodka_kredit AS kredit_schet
                FROM iznos_tovar_jur7 i
                JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id
                JOIN group_jur7 AS g ON g.id = p.group_jur7_id
                JOIN users AS u ON u.id = i.user_id 
                JOIN regions AS r ON r.id = u.region_id
                WHERE i.budjet_id = $1
                    AND r.id = $2
                    AND i.full_date BETWEEN $3 AND $4
            )
            WHERE debet_schet = $5 AND kredit_schet = $6;
        `;
        const result = await db.query(query, params);
        return result[0].summa;
    }

    static async getDebetSubSchetsForCap(params) {
        const query = `--sql
            SELECT DISTINCT debet_sub_schet  
            FROM (
                SELECT ch.debet_sub_schet
                FROM document_rasxod_jur7 d
                JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id 
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE m.spravochnik_budjet_name_id = $1
                    AND  r.id = $2
                    AND d.doc_date BETWEEN $3 AND $4

                UNION ALL

                SELECT ch.debet_sub_schet
                FROM document_vnutr_peremesh_jur7 d
                JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id 
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE m.spravochnik_budjet_name_id = $1
                    AND  r.id = $2
                    AND d.doc_date BETWEEN $3 AND $4
            ); 
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getDebetSubSchetSumma(params) {
        const query = `--sql
            SELECT COALESCE(SUM(summa_s_nds), 0)::FLOAt AS summa 
            FROM (
                SELECT ch.summa_s_nds, ch.debet_sub_schet
            FROM document_rasxod_jur7 d
            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id 
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE m.spravochnik_budjet_name_id = $1
                AND  r.id = $2
                AND d.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT ch.summa_s_nds, ch.debet_sub_schet
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id 
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE m.spravochnik_budjet_name_id = $1
                AND  r.id = $2
                AND d.doc_date BETWEEN $3 AND $4
            )
            WHERE debet_sub_schet = $5;
        `;
        const result = await db.query(query, params);
        return result[0].summa;
    }

    static async getKreditSubSchetsForCap(params) {
        const query = `--sql
            SELECT DISTINCT kredit_sub_schet  
            FROM (
                SELECT ch.kredit_sub_schet
                FROM document_rasxod_jur7 d
                JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id 
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE m.spravochnik_budjet_name_id = $1
                    AND  r.id = $2
                    AND d.doc_date BETWEEN $3 AND $4

                UNION ALL

                SELECT ch.kredit_sub_schet
                FROM document_vnutr_peremesh_jur7 d
                JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id 
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE m.spravochnik_budjet_name_id = $1
                    AND  r.id = $2
                    AND d.doc_date BETWEEN $3 AND $4
            ); 
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getKreditSubSchetSumma(params) {
        const query = `--sql
            SELECT COALESCE(SUM(summa_s_nds), 0)::FLOAt AS summa 
            FROM (
                SELECT ch.summa_s_nds, ch.kredit_sub_schet
            FROM document_rasxod_jur7 d
            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id 
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE m.spravochnik_budjet_name_id = $1
                AND  r.id = $2
                AND d.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT ch.summa_s_nds, ch.kredit_sub_schet
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id 
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE m.spravochnik_budjet_name_id = $1
                AND  r.id = $2
                AND d.doc_date BETWEEN $3 AND $4
            )
            WHERE kredit_sub_schet = $5;
        `;
        const result = await db.query(query, params);
        return result[0].summa;
    }

    static async getIznosSummaByProvodkaSubSchet(params) {
        const query = `
            SELECT 
                g.provodka_subschet,
                COALESCE(SUM(i.iznos_summa), 0)::FLOAT AS summa
            FROM iznos_tovar_jur7 i
            JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id
            JOIN group_jur7 AS g ON g.id = p.group_jur7_id
            JOIN users AS u ON u.id = i.user_id 
            JOIN regions AS r ON r.id = u.region_id
            WHERE i.budjet_id = $1
                AND r.id = $2
                AND i.full_date BETWEEN $3 AND $4
            GROUP BY g.provodka_subschet
        `;
        const result = await db.query(query, params);
        return result;
    }
}