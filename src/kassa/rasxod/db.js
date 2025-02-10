const { db } = require('../../db/index')

exports.KassaRasxodDB = class {
    static async create(params, client) {
        const query = `
            INSERT INTO kassa_rasxod(
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
            INSERT INTO kassa_rasxod_child (
              spravochnik_operatsii_id,
              summa,
              id_spravochnik_podrazdelenie, 
              id_spravochnik_sostav, 
              id_spravochnik_type_operatsii,
              kassa_rasxod_id,
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

    static async get(params, search) {
        let search_filter = ``;
        
        if (search) {
            params.push(search);
            search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.name ILIKE '%' || $${params.length} || '%' OR 
                so.inn ILIKE '%' || $${params.length} || '%'
            )`;
        }
        
        const query = `
                WITH data AS (
                    SELECT 
                        d.id, 
                        d.doc_num,
                        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                        d.opisanie, 
                        d.summa, 
                        d.id_podotchet_litso,
                        p.name AS spravochnik_podotchet_litso_name,
                        p.rayon AS spravochnik_podotchet_litso_rayon,
                        d.main_zarplata_id,
                        (
                            SELECT ARRAY_AGG(row_to_json(k_p_ch))
                            FROM (
                                SELECT 
                                    s_o.schet AS provodki_schet,
                                    s_o.sub_schet AS provodki_sub_schet
                                FROM kassa_rasxod_child AS k_p_ch
                                JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                                WHERE  k_p_ch.kassa_rasxod_id = d.id 
                            ) AS k_p_ch
                        ) AS provodki_array
                    FROM kassa_rasxod AS d
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4 
                        ${search_filter}    
                    ORDER BY d.doc_date
                    OFFSET $5 LIMIT $6
                )
                SELECT 
                    ARRAY_AGG(row_to_json(data)) AS data,
                    (
                        SELECT COALESCE(SUM(d.summa), 0)
                        FROM kassa_rasxod AS d
                        JOIN users AS u ON u.id = d.user_id
                        JOIN regions AS r ON r.id = u.region_id  
                        LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
                        WHERE d.main_schet_id = $2 
                            AND r.id = $1
                            AND d.doc_date BETWEEN $3 AND $4 
                            AND d.isdeleted = false
                            ${search_filter}
                    )::FLOAT AS summa,
                    (
                        SELECT COALESCE(COUNT(d.id), 0)
                        FROM kassa_rasxod AS d
                        JOIN users AS u ON u.id = d.user_id
                        JOIN regions AS r ON r.id = u.region_id  
                        LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
                        WHERE r.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.doc_date BETWEEN $3 AND $4 
                            AND d.isdeleted = false
                            ${search_filter}
                    )::INTEGER AS total_count
                FROM data
            `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async getById(params, isdeleted) {
        const query = `
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.opisanie, 
                d.summa::FLOAT, 
                d.id_podotchet_litso,
                p.name AS spravochnik_podotchet_litso_name,
                p.rayon AS spravochnik_podotchet_litso_rayon,
                d.main_zarplata_id,
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
                        FROM kassa_rasxod_child AS k_p_ch 
                        JOIN users AS u ON u.id = d.user_id
                        JOIN regions AS r ON r.id = u.region_id   
                        WHERE r.id = $1 
                        AND k_p_ch.main_schet_id = $2 
                        AND k_p_ch.kassa_rasxod_id = d.id
                    ) AS k_p_ch
                ) AS childs
            FROM kassa_rasxod AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.id = $3
                ${!isdeleted ? 'AND d.isdeleted = false' : ''}
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async update(params, client) {
        const result = await client.query(`
            UPDATE kassa_rasxod SET 
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
        await client.query(`DELETE FROM kassa_rasxod_child  WHERE kassa_rasxod_id = $1`, params);
    }

    static async delete(params, client) {
        await client.query(`UPDATE kassa_rasxod_child SET isdeleted = true WHERE kassa_rasxod_id = $1`, params);
        
        const result = await client.query(`UPDATE kassa_rasxod SET isdeleted = true WHERE id = $1 RETURNING id`, params);
        
        return result.rows[0];
    }
}