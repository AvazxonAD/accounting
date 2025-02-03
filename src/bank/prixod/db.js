const { db } = require('../../db/index')

exports.BankPrixodDB = class {
    static async createPrixod(params, client) {
        const query = `
            INSERT INTO bank_prixod(
                doc_num, 
                doc_date, 
                summa, 
                provodki_boolean, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING id
        `;

        const result = await client.query(query, params);

        return result.rows[0]
    }

    static async createPrixodChild(params, _values, client) {
        const query = `
            INSERT INTO bank_prixod_child (
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                id_spravochnik_podotchet_litso,
                main_schet_id,
                id_bank_prixod,
                user_id,
                main_zarplata_id
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
                    p.id,
                    p.doc_num, 
                    TO_CHAR(p.doc_date, 'YYYY-MM-DD') AS doc_date, 
                    p.summa, 
                    p.provodki_boolean, 
                    p.dop_provodki_boolean, 
                    p.opisanie, 
                    p.id_spravochnik_organization, 
                    s_o.name AS spravochnik_organization_name,
                    s_o.okonx AS spravochnik_organization_okonx,
                    s_o.bank_klient AS spravochnik_organization_bank_klient,
                    s_o.raschet_schet AS spravochnik_organization_raschet_schet,
                    s_o.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                    s_o.mfo AS spravochnik_organization_mfo,
                    s_o.inn AS spravochnik_organization_inn,
                    p.id_shartnomalar_organization,
                    (
                        SELECT ARRAY_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM bank_prixod_child AS ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                            WHERE  ch.id_bank_prixod = p.id 
                        ) AS ch
                    ) AS provodki_array 
                FROM bank_prixod AS p
                JOIN users AS u ON p.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS s_o ON s_o.id = p.id_spravochnik_organization 
                WHERE p.main_schet_id = $2 AND r.id = $1 AND p.isdeleted = false AND doc_date BETWEEN $3 AND $4 ORDER BY p.doc_date OFFSET $5 LIMIT $6)
                
                SELECT 
                    ARRAY_AGG(row_to_json(data)) AS data,
                    (
                        SELECT SUM(bank_prixod.summa)
                        FROM bank_prixod 
                        JOIN users ON bank_prixod.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE bank_prixod.main_schet_id = $2 
                            AND bank_prixod.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date BETWEEN $3 AND $4
                    )::FLOAT AS summa,
                    (
                        SELECT COUNT(bank_prixod.id)
                        FROM bank_prixod 
                        JOIN users ON bank_prixod.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE regions.id = $1 AND 
                            bank_prixod.main_schet_id = $2 
                            AND bank_prixod.isdeleted = false 
                            AND doc_date BETWEEN $3 AND $4
                    )::FLOAT AS total_count
                FROM data
            `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async getById(params, isdeleted) {
        const query = `
            SELECT 
                p.id,
                p.doc_num, 
                TO_CHAR(p.doc_date, 'YYYY-MM-DD') AS doc_date, 
                p.summa::FLOAT, 
                p.provodki_boolean, 
                p.dop_provodki_boolean, 
                p.opisanie, 
                p.id_spravochnik_organization, 
                p.id_shartnomalar_organization,
                (
                    SELECT ARRAY_AGG(row_to_json(ch))
                    FROM (
                        SELECT 
                            ch.id,
                            ch.spravochnik_operatsii_id,
                            s_o.name AS spravochnik_operatsii_name,
                            ch.summa,
                            ch.id_spravochnik_podrazdelenie,
                            s_p.name AS spravochnik_podrazdelenie_name,
                            ch.id_spravochnik_sostav,
                            s_s.name AS spravochnik_sostav_name,
                            ch.id_spravochnik_type_operatsii,
                            s_t_o.name AS spravochnik_type_operatsii_name,
                            ch.id_spravochnik_podotchet_litso,
                            s_p_l.name AS spravochnik_podotchet_litso_name,
                            ch.main_zarplata_id
                        FROM bank_prixod_child AS ch
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                        LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = ch.id_spravochnik_podrazdelenie
                        LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = ch.id_spravochnik_sostav
                        LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = ch.id_spravochnik_type_operatsii
                        LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = ch.id_spravochnik_podotchet_litso
                        WHERE ch.id_bank_prixod = p.id 
                    ) AS ch
                ) AS childs 
            FROM bank_prixod AS p
            JOIN users AS u ON p.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            WHERE r.id = $1 
                AND p.main_schet_id = $2 
                AND p.id = $3
                ${!isdeleted ? 'AND p.isdeleted = false' : ''}
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async update(params, client) {
        const result = await client.query(`
            UPDATE bank_prixod SET 
                doc_num = $1, 
                doc_date = $2, 
                summa = $3,
                provodki_boolean = $4, 
                opisanie = $5, 
                id_spravochnik_organization = $6, 
                id_shartnomalar_organization = $7
            WHERE id = $8 RETURNING id
        `, params);

        return result.rows[0];
    }

    static async deleteChild(params, client) {
        await client.query(`DELETE FROM bank_prixod_child  WHERE id_bank_prixod = $1`, params);
    }

    static async delete(params, client) {
        await client.query(`UPDATE bank_prixod_child SET isdeleted = true WHERE id_bank_prixod = $1`, params);

        const result = await client.query(`UPDATE bank_prixod SET isdeleted = true WHERE id = $1 RETURNING id`, params);

        return result.rows[0];
    }
}