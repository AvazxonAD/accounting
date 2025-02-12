const { db } = require('@db/index')

exports.ControlDB = class {
    static async getTablesCount(params) {
        const query = `--sql
            WITH kassa_rasxodCount AS (
                SELECT COALESCE(COUNT(k.id), 0)::INTEGER AS count
                FROM kassa_rasxod AS k
                JOIN users AS u ON u.id = k.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM k.doc_date) = $1 AND EXTRACT(MONTH FROM k.doc_date) = $2 AND r.id = $3 
            ),
            kassa_prixodCount AS (
                SELECT COALESCE(COUNT(k.id), 0)::INTEGER AS count
                FROM kassa_prixod AS k
                JOIN users AS u ON u.id = k.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM k.doc_date) = $1 AND EXTRACT(MONTH FROM k.doc_date) = $2 AND r.id = $3 
            ),
            bank_rasxodCount AS (
                SELECT COALESCE(COUNT(b.id), 0)::INTEGER AS count
                FROM bank_rasxod AS b
                JOIN users AS u ON u.id = b.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM b.doc_date) = $1 AND EXTRACT(MONTH FROM b.doc_date) = $2 AND r.id = $3 
            ),
            bank_prixodCount AS (
                SELECT COALESCE(COUNT(b.id), 0)::INTEGER AS count
                FROM bank_prixod AS b
                JOIN users AS u ON u.id = b.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM b.doc_date) = $1 AND EXTRACT(MONTH FROM b.doc_date) = $2 AND r.id = $3 
            ),
            avans_otchetlar_jur4Count AS (
                SELECT COALESCE(COUNT(a.id), 0)::INTEGER AS count
                FROM avans_otchetlar_jur4 AS a
                JOIN users AS u ON u.id = a.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM a.doc_date) = $1 AND EXTRACT(MONTH FROM a.doc_date) = $2 AND r.id = $3 
            ),
            kursatilgan_hizmatlar_jur152Count AS (
                SELECT COALESCE(COUNT(k_h.id), 0)::INTEGER AS count
                FROM kursatilgan_hizmatlar_jur152 AS k_h
                JOIN users AS u ON u.id = k_h.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM k_h.doc_date) = $1 AND EXTRACT(MONTH FROM k_h.doc_date) = $2 AND r.id = $3 
            ),
            bajarilgan_ishlar_jur3Count AS (
                SELECT COALESCE(COUNT(b_j.id), 0)::INTEGER AS count
                FROM bajarilgan_ishlar_jur3 AS b_j
                JOIN users AS u ON u.id = b_j.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM b_j.doc_date) = $1 AND EXTRACT(MONTH FROM b_j.doc_date) = $2 AND r.id = $3 
            ),
            document_vnutr_peremesh_jur7Count AS (
                SELECT COALESCE(COUNT(i.id), 0)::INTEGER AS count
                FROM document_vnutr_peremesh_jur7 AS i
                JOIN users AS u ON u.id = i.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM i.doc_date) = $1 AND EXTRACT(MONTH FROM i.doc_date) = $2 AND r.id = $3 
            ),
            document_prixod_jur7Count AS (
                SELECT COALESCE(COUNT(p.id), 0)::INTEGER AS count
                FROM document_prixod_jur7 AS p
                JOIN users AS u ON u.id = p.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM p.doc_date) = $1 AND EXTRACT(MONTH FROM p.doc_date) = $2 AND r.id = $3 
            ),
            document_rasxod_jur7Count AS (
                SELECT COALESCE(COUNT(r.id), 0)::INTEGER AS count
                FROM document_rasxod_jur7 AS d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE EXTRACT(YEAR FROM d.doc_date) = $1 AND EXTRACT(MONTH FROM d.doc_date) = $2 AND r.id = $3 
            ),
            contractCount AS (
                SELECT COALESCE(COUNT(sh.id), 0)::INTEGER AS count
                FROM shartnomalar_organization AS sh
                JOIN users AS u ON u.id = sh.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE  r.id = $3 
            ),
            main_schetCount AS (
                SELECT COALESCE(COUNT(c.id), 0)::INTEGER AS count
                FROM main_schet AS c
                JOIN users AS u ON u.id = c.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $3 
            ),
            organizationCount AS (
                SELECT COALESCE(COUNT(c.id), 0)::INTEGER AS count
                FROM spravochnik_organization AS c
                JOIN users AS u ON u.id = c.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $3 
            ),
            podotchetCount AS (
                SELECT COALESCE(COUNT(c.id), 0)::INTEGER AS count
                FROM spravochnik_podotchet_litso AS c
                JOIN users AS u ON u.id = c.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $3 
            ),
            podrazdelenieCount AS (
                SELECT COALESCE(COUNT(c.id), 0)::INTEGER AS count
                FROM spravochnik_podrazdelenie AS c
                JOIN users AS u ON u.id = c.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $3 
            ),
            sostavCount AS (
                SELECT COALESCE(COUNT(c.id), 0)::INTEGER AS count
                FROM spravochnik_sostav AS c
                JOIN users AS u ON u.id = c.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $3 
            ),
            type_operatsiiCount AS (
                SELECT COALESCE(COUNT(c.id), 0)::INTEGER AS count
                FROM spravochnik_type_operatsii AS c
                JOIN users AS u ON u.id = c.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $3 
            )
            SELECT
                (
                    (SELECT count FROM kassa_rasxodCount) +
                    (SELECT count FROM kassa_prixodCount) 
                ) AS kassa_count, 
                ( 
                    (SELECT count FROM bank_rasxodCount) +
                    (SELECT count FROM bank_prixodCount) 
                
                ) AS bank_count,
                ( 
                    (SELECT count FROM avans_otchetlar_jur4Count) +
                    (SELECT count FROM kursatilgan_hizmatlar_jur152Count) +
                    (SELECT count FROM contractCount) +
                    (SELECT count FROM bajarilgan_ishlar_jur3Count) 
                ) AS organ_count,
                (
                    (SELECT count FROM document_vnutr_peremesh_jur7Count) +
                    (SELECT count FROM document_prixod_jur7Count) +
                    (SELECT count FROM document_rasxod_jur7Count)
                ) AS jur7_count,
                (
                    (SELECT count FROM main_schetCount) +
                    (SELECT count FROM organizationCount) +
                    (SELECT count FROM podrazdelenieCount) +
                    (SELECT count FROM sostavCount) +
                    (SELECT count FROM organizationCount) +
                    (SELECT count FROM podotchetCount)
                ) AS storage_count,
                (
                    (SELECT count FROM kassa_rasxodCount) +
                    (SELECT count FROM kassa_prixodCount) +
                    (SELECT count FROM bank_rasxodCount) +
                    (SELECT count FROM bank_prixodCount) +
                    (SELECT count FROM avans_otchetlar_jur4Count) +
                    (SELECT count FROM kursatilgan_hizmatlar_jur152Count) +
                    (SELECT count FROM bajarilgan_ishlar_jur3Count) +
                    (SELECT count FROM document_vnutr_peremesh_jur7Count) +
                    (SELECT count FROM document_prixod_jur7Count) +
                    (SELECT count FROM document_rasxod_jur7Count) + 
                    (SELECT count FROM main_schetCount) +
                    (SELECT count FROM organizationCount) +
                    (SELECT count FROM podrazdelenieCount) +
                    (SELECT count FROM sostavCount) +
                    (SELECT count FROM organizationCount) +
                    (SELECT count FROM podotchetCount)
                ) AS total_count
        `;
        const result = await db.query(query, params);
        return result[0]
    }
}

