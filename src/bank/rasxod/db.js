const { db } = require('../../db/index')

exports.BankRasxodDB = class {
    static async createPrixod(params, client) {
        const query = `
            INSERT INTO bank_rasxod(
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_podotchet_litso,
                main_schet_id, 
                user_id,
                created_at,
                updated_at,
                main_zarplata_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING id
        `;

        const result = await client.query(query, params);

        return result.rows[0]
    }

    static async createPrixodChild(params, _values, client) {
        const query = `
            INSERT INTO bank_rasxod_child (
              spravochnik_operatsii_id,
              summa,
              id_spravochnik_podrazdelenie, 
              id_spravochnik_sostav, 
              id_spravochnik_type_operatsii,
              bank_rasxod_id,
              user_id, 
              main_schet_id, 
              created_at, 
              updated_at
          )
          VALUES ${_values}
        `;

        const result = await client.query(query, params);

        return result;
    }

    static async get(params) {
        const query = `
                WITH data AS (
                    SELECT 
                        r.id, 
                        r.doc_num,
                        TO_CHAR(r.doc_date, 'YYYY-MM-DD') AS doc_date, 
                        r.opisanie, 
                        r.summa, 
                        r.id_podotchet_litso,
                        s_p_l.name AS spravochnik_podotchet_litso_name,
                        s_p_l.rayon AS spravochnik_podotchet_litso_rayon,
                        r.main_zarplata_id,
                        (
                            SELECT ARRAY_AGG(row_to_json(k_p_ch))
                            FROM (
                                SELECT 
                                    s_o.schet AS provodki_schet,
                                    s_o.sub_schet AS provodki_sub_schet
                                FROM bank_rasxod_child AS k_p_ch
                                JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                                WHERE  k_p_ch.bank_rasxod_id = r.id 
                            ) AS k_p_ch
                        ) AS provodki_array
                    FROM bank_rasxod AS r
                    JOIN users AS u ON u.id = r.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = r.id_podotchet_litso
                    WHERE r.id = $1 AND r.main_schet_id = $2 AND r.isdeleted = false AND r.doc_date BETWEEN $3 AND $4 ORDER BY r.doc_date
                    OFFSET $5 LIMIT $6
                )
                SELECT 
                    ARRAY_AGG(row_to_json(data)) AS data,
                    (
                        SELECT COALESCE(SUM(r.summa), 0)
                        FROM bank_rasxod AS r
                        JOIN users AS u ON u.id = r.user_id
                        JOIN regions AS r ON r.id = u.region_id  
                        WHERE r.main_schet_id = $2 
                            AND r.id = $1
                            AND r.doc_date BETWEEN $3 AND $4 
                            AND r.isdeleted = false
                    )::FLOAT AS summa,
                    (
                        SELECT COALESCE(COUNT(r.id), 0)
                        FROM bank_rasxod AS r
                        JOIN users AS u ON u.id = r.user_id
                        JOIN regions AS r ON r.id = u.region_id  
                        WHERE r.id = $1 
                            AND r.main_schet_id = $2 
                            AND r.doc_date BETWEEN $3 AND $4 
                            AND r.isdeleted = false
                    )::INTEGER AS total_count
                FROM data
            `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async getById(params, isdeleted) {
        const query = `
            SELECT 
                r.id, 
                r.doc_num,
                TO_CHAR(r.doc_date, 'YYYY-MM-DD') AS doc_date, 
                r.opisanie, 
                r.summa::FLOAT, 
                r.id_podotchet_litso,
                s_p_l.name AS spravochnik_podotchet_litso_name,
                s_p_l.rayon AS spravochnik_podotchet_litso_rayon,
                r.main_zarplata_id,
                (
                    SELECT ARRAY_AGG(row_to_json(k_p_ch))
                    FROM (
                        SELECT  
                            k_p_ch.id,
                            k_p_ch.spravochnik_operatsii_id,
                            k_p_ch.summa,
                            k_p_ch.id_spravochnik_podrazdelenie,
                            k_p_ch.id_spravochnik_sostav,
                            k_p_ch.id_spravochnik_type_operatsii
                        FROM bank_rasxod_child AS k_p_ch 
                        JOIN users AS u ON u.id = r.user_id
                        JOIN regions AS r ON r.id = u.region_id   
                        WHERE r.id = $1 
                        AND k_p_ch.main_schet_id = $2 
                        AND k_p_ch.bank_rasxod_id = r.id
                    ) AS k_p_ch
                ) AS childs
            FROM bank_rasxod AS r
            JOIN users AS u ON u.id = r.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = r.id_podotchet_litso
            WHERE r.id = $1 
                AND r.main_schet_id = $2 
                AND r.id = $3
                ${!isdeleted ? 'AND r.isdeleted = false' : ''}
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async update(params, client) {
        const result = await client.query(`
            UPDATE bank_rasxod SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3, 
                summa = $4, 
                id_podotchet_litso = $5, 
                updated_at = $6,
                main_zarplata_id = $8
            WHERE id = $7 RETURNING id 
        `, params);

        return result.rows[0];
    }

    static async deleteChild(params, client) {
        await client.query(`DELETE FROM bank_rasxod_child  WHERE bank_rasxod_id = $1`, params);
    }

    static async delete(params, client) {
        await client.query(`UPDATE bank_rasxod_child SET isdeleted = true WHERE bank_rasxod_id = $1`, params);
        
        const result = await client.query(`UPDATE bank_rasxod SET isdeleted = true WHERE id = $1 RETURNING id`, params);
        
        return result.rows[0];
    }
}