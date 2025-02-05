const { db } = require('../../db/index')

exports.BankRasxodDB = class {
    static async payment(params, client) {
        let extraQuery = '';
        if (params[0]) {
            extraQuery = `summa = tulanmagan_summa`;
        } else {
            extraQuery = `summa = 0`;
        }

        const queryParent = `--sql
            UPDATE bank_rasxod 
            SET tulangan_tulanmagan = $1, ${extraQuery}
            WHERE id = $2 
                AND isdeleted = false RETURNING id`

        const queryChild = `--sql
            UPDATE bank_rasxod_child 
            SET tulangan_tulanmagan = $1, ${extraQuery}
            WHERE id_bank_rasxod = $2 AND isdeleted = false;
        `;

        await client.query(queryChild, params);
        const result = await client.query(queryParent, params);

        return result.rows[0];
    }

    static async create(params, client) {
        const query = `
             INSERT INTO bank_rasxod(
                doc_num, 
                doc_date, 
                tulanmagan_summa, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id,
                rukovoditel,
                glav_buxgalter,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING id
        `;

        const result = await client.query(query, params);

        return result.rows[0]
    }

    static async createPrixodChild(params, _values, client) {
        const query = `
            INSERT INTO bank_rasxod_child (
               spravochnik_operatsii_id,
                tulanmagan_summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                main_schet_id,
                id_bank_rasxod,
                user_id,
                main_zarplata_id,
                id_spravochnik_podotchet_litso,
                created_at,
                updated_at
          )
          VALUES ${_values}
        `;

        const result = await client.query(query, params);

        return result;
    }

    static async get(params, search = null) {
        let search_filter = ``;
        if (search) {
            params.push(search);
            search_filter = ` AND d.doc_num = $${params.length}`;
        }

        const query = `
            WITH data AS (
                SELECT 
                d.id,
                d.doc_num, 
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.summa, 
                d.opisanie, 
                d.id_spravochnik_organization, 
                s_o.name AS spravochnik_organization_name,
                s_o.okonx AS spravochnik_organization_okonx,
                s_o.bank_klient AS spravochnik_organization_bank_klient,
                s_o.raschet_schet AS spravochnik_organization_raschet_schet,
                s_o.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                s_o.mfo AS spravochnik_organization_mfo,
                s_o.inn AS spravochnik_organization_inn,
                d.id_shartnomalar_organization,
                d.rukovoditel,
                d.glav_buxgalter,
                d.tulanmagan_summa::FLOAT,
                d.tulangan_tulanmagan,
                (
                    SELECT ARRAY_AGG(row_to_json(ch))
                    FROM (
                        SELECT 
                            s_o.schet AS provodki_schet,
                            s_o.sub_schet AS provodki_sub_schet
                        FROM bank_rasxod_child AS ch
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                        WHERE  ch.id_bank_rasxod = d.id 
                    ) AS ch
                ) AS provodki_array 
                FROM bank_rasxod AS d
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS s_o ON s_o.id = d.id_spravochnik_organization 
                WHERE d.main_schet_id = $1 
                    AND r.id = $2 
                    AND d.isdeleted = false 
                    AND doc_date BETWEEN $3 AND $4 
                    ${search_filter}
                ORDER BY d.doc_date, d.doc_num 
                OFFSET $5 LIMIT $6
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT 
                        COALESCE(SUM(d.summa), 0)
                    FROM bank_rasxod d
                    JOIN users ON d.user_id = users.id
                    JOIN regions ON users.region_id = regions.id
                    WHERE d.main_schet_id = $1 
                        AND d.isdeleted = false 
                        AND regions.id = $2 
                        AND doc_date BETWEEN $3 AND $4
                        ${search_filter}
                )::FLOAT AS summa,
                (
                    SELECT 
                        COALESCE(COUNT(d.id), 0)
                    FROM bank_rasxod d
                    JOIN users ON d.user_id = users.id
                    JOIN regions ON users.region_id = regions.id
                    WHERE d.main_schet_id = $1 
                        AND d.isdeleted = false 
                        AND regions.id = $2  
                        AND doc_date BETWEEN $3 AND $4
                        ${search_filter}
                )::FLOAT AS total_count
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
                d.summa::FLOAT, 
                d.opisanie, 
                d.id_spravochnik_organization, 
                d.id_shartnomalar_organization,
                d.rukovoditel,
                d.tulanmagan_summa::FLOAT,
                d.glav_buxgalter,
                (
                    SELECT 
                        ARRAY_AGG(row_to_json(ch))
                    FROM (
                        SELECT 
                            ch.id,
                            ch.spravochnik_operatsii_id,
                            s_o.name AS spravochnik_operatsii_name,
                            ch.summa::FLOAT,
                            ch.id_spravochnik_podrazdelenie,
                            s_p.name AS spravochnik_podrazdelenie_name,
                            ch.id_spravochnik_sostav,
                            s_s.name AS spravochnik_sostav_name,
                            ch.id_spravochnik_type_operatsii,
                            s_t_o.name AS spravochnik_type_operatsii_name,
                            ch.main_zarplata_id,
                            ch.id_spravochnik_podotchet_litso,
                            s_p_l.name AS spravochnik_podotchet_litso_name,
                            ch.tulanmagan_summa::FLOAT
                        FROM bank_rasxod_child AS ch
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                        LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = ch.id_spravochnik_podrazdelenie
                        LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = ch.id_spravochnik_sostav
                        LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = ch.id_spravochnik_type_operatsii
                        LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = ch.id_spravochnik_podotchet_litso
                        WHERE ch.id_bank_rasxod = d.id 
                    ) AS ch
                ) AS childs 
            FROM bank_rasxod AS d
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            WHERE d.main_schet_id = $1 AND r.id = $2 AND d.id = $3
                ${!isdeleted ? 'AND d.isdeleted = false' : ''}
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async update(params, client) {
        const result = await client.query(`
            UPDATE bank_rasxod SET 
                doc_num = $1, 
                doc_date = $2, 
                tulanmagan_summa = $3, 
                opisanie = $4, 
                id_spravochnik_organization = $5, 
                id_shartnomalar_organization = $6,
                rukovoditel = $7,
                glav_buxgalter = $8,
                summa = 0,
                updated_at = $9,
                tulangan_tulanmagan = false
            WHERE id = $10 RETURNING id 
        `, params);

        return result.rows[0];
    }

    static async deleteChild(params, client) {
        await client.query(`DELETE FROM bank_rasxod_child  WHERE id_bank_rasxod = $1`, params);
    }

    static async delete(params, client) {
        await client.query(`UPDATE bank_rasxod_child SET isdeleted = true WHERE id_bank_rasxod = $1`, params);

        const result = await client.query(`UPDATE bank_rasxod SET isdeleted = true WHERE id = $1 RETURNING id`, params);

        return result.rows[0];
    }

    static async fio(params) {
        const query = `
            SELECT 
              b.rukovoditel,
              b.glav_buxgalter
            FROM bank_rasxod b 
            JOIN users AS u ON u.id = b.user_id 
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 
              AND b.main_schet_id = $2 
              AND b.glav_buxgalter IS NOT NULL 
              AND b.created_at IS NOT NULL
            ORDER BY b.created_at DESC
        `;

        const result = await db.query(query, params);

        return result;
    }
}