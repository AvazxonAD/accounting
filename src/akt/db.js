const { db } = require('../db/index');

exports.AktDB = class {
    static async getByOrganizationIdAkt(params, client) {
        const query = `--sql
            SELECT 
                b_i_j3.id,
                b_i_j3.doc_num,
                b_i_j3.doc_date,
                b_i_j3.opisanie,
                b_i_j3_ch.summa::FLOAT AS summa_rasxod, 
                0::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_op.schet AS provodki_schet, 
                s_op.sub_schet AS provodki_sub_schet
            FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch
            JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id = b_i_j3_ch.bajarilgan_ishlar_jur3_id
            JOIN users AS u ON b_i_j3.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_i_j3.shartnomalar_organization_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS s_o ON s_o.id = b_i_j3.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_i_j3.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_i_j3_ch.spravochnik_operatsii_id
            WHERE b_i_j3.isdeleted = false 
                AND r.id = $1
                AND b_i_j3.main_schet_id = $2
                AND s_o_p.schet = $3
                AND b_i_j3.doc_date BETWEEN $4 AND $5
                AND b_i_j3.id_spravochnik_organization = $6 OFFSET $7 LIMIT $8 ORDER BY doc_date
        `;
        const result = await client.query(query, params);
        return result.rows;
    }
}