const pool = require("../config/db");
const { tashkentTime } = require('../utils/date.function');
const ErrorResponse = require("../utils/errorResponse");

const createJur3DB = async (data) => {
  const client = await pool.connect()
  try {
    await client.query(`BEGIN`)
    const doc = await client.query(
      `
              INSERT INTO bajarilgan_ishlar_jur3(
                  doc_num, 
                  doc_date, 
                  opisanie, 
                  summa, 
                  id_spravochnik_organization, 
                  shartnomalar_organization_id, 
                  main_schet_id,
                  user_id,
                  spravochnik_operatsii_own_id,
                  created_at,
                  updated_at
              ) 
              VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
              RETURNING * 
              `,
      [
        data.doc_num,
        data.doc_date,
        data.opisanie,
        data.summa,
        data.id_spravochnik_organization,
        data.shartnomalar_organization_id,
        data.main_schet_id,
        data.user_id,
        data.spravochnik_operatsii_own_id,
        tashkentTime(),
        tashkentTime()
      ],
    );

    const result = doc.rows[0]
    data.childs = data.childs.map(item => {
          return {
            spravochnik_operatsii_id: item.spravochnik_operatsii_id,
            summa: item.summa,
            id_spravochnik_podrazdelenie: item.id_spravochnik_podrazdelenie,
            id_spravochnik_sostav: item.id_spravochnik_sostav,
            id_spravochnik_type_operatsii: item.id_spravochnik_type_operatsii,
            main_schet_id: data.main_schet_id,
            bajarilgan_ishlar_jur3_id: result.id,
            user_id: data.user_id,
            spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id,
            created_at: tashkentTime(),
            updated_at: tashkentTime()
          }
    }) 
    const values = data.childs.map((_, index) => `($${11 * index + 1}, $${11 * index + 2}, $${11 * index + 3}, $${11 * index + 4}, $${11 * index + 5}, $${11 * index + 6}, $${11 * index + 7}, $${11 * index + 8}, $${11 * index + 9}, $${11 * index + 10}, $${11 * index + 11})`);
    const allValues = data.childs.reduce((acc, obj) => {
      return acc.concat(Object.values(obj));
    }, []);
    const _values = values.join(", ")
    const query = `
      INSERT INTO bajarilgan_ishlar_jur3_child(
          spravochnik_operatsii_id,
          summa,
          id_spravochnik_podrazdelenie,
          id_spravochnik_sostav,
          id_spravochnik_type_operatsii,
          main_schet_id,
          bajarilgan_ishlar_jur3_id,
          user_id,
          spravochnik_operatsii_own_id,
          created_at,
          updated_at
        ) 
        VALUES ${_values} RETURNING *
    `;
    const childs = await client.query(query, allValues);
    const docs = childs.rows;
    result.childs = docs;
    await client.query('COMMIT')
    return result;
  } catch (error) {
    await client.query(`ROLLBACK`)
    throw new ErrorResponse(error, error.statusCode)
  } finally {
    client.release()
  }
}

const createJur3ChildDB = async (data) => {
  try {
    const result = await pool.query(
      `
                INSERT INTO bajarilgan_ishlar_jur3_child(
                    spravochnik_operatsii_id,
                    summa,
                    id_spravochnik_podrazdelenie,
                    id_spravochnik_sostav,
                    id_spravochnik_type_operatsii,
                    main_schet_id,
                    bajarilgan_ishlar_jur3_id,
                    user_id,
                    spravochnik_operatsii_own_id,
                    created_at
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        data.spravochnik_operatsii_id,
        data.summa,
        data.id_spravochnik_podrazdelenie,
        data.id_spravochnik_sostav,
        data.id_spravochnik_type_operatsii,
        data.main_schet_id,
        data.bajarilgan_ishlar_jur3_id,
        data.user_id,
        data.spravochnik_operatsii_own_id,
        tashkentTime(),
      ],
    );

    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllJur3DB = async (region_id, main_schet_id, from, to, offset, limit) => {
  try {
    const filter = `b_i_j3.main_schet_id = $1 AND r.id = $2 AND b_i_j3.isdeleted = false AND b_i_j3.doc_date BETWEEN $3 AND $4`
    const chhild_filter = `b_i_j_ch.main_schet_id = $1 AND r.id = $2 AND b_i_j_ch.bajarilgan_ishlar_jur3_id = b_i_j3.id`
    const { rows } = await pool.query(
      ` 
          WITH data AS 
            (
              SELECT 
                b_i_j3.id, 
                b_i_j3.doc_num,
                TO_CHAR(b_i_j3.doc_date, 'YYYY-MM-DD') AS doc_date, 
                b_i_j3.opisanie, 
                b_i_j3.summa::FLOAT, 
                b_i_j3.id_spravochnik_organization,
                s_o.name AS spravochnik_organization_name,
                s_o.raschet_schet AS spravochnik_organization_raschet_schet,
                s_o.inn AS spravochnik_organization_inn, 
                b_i_j3.shartnomalar_organization_id,
                sh_o.doc_num AS shartnomalar_organization_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
                b_i_j3.spravochnik_operatsii_own_id,
                (
                  SELECT ARRAY_AGG(row_to_json(b_i_j_ch))
                  FROM (
                      SELECT  
                        b_i_j_ch.id,
                        b_i_j_ch.bajarilgan_ishlar_jur3_id,
                        b_i_j_ch.spravochnik_operatsii_id,
                        s_o.name AS spravochnik_operatsii_name,
                        b_i_j_ch.summa::FLOAT,
                        b_i_j_ch.id_spravochnik_podrazdelenie,
                        s_p.name AS spravochnik_podrazdelenie_name,
                        b_i_j_ch.id_spravochnik_sostav,
                        s_s.name AS spravochnik_sostav_name,
                        b_i_j_ch.id_spravochnik_type_operatsii,
                        s_t_o.name AS spravochnik_type_operatsii_name
                      FROM bajarilgan_ishlar_jur3_child AS b_i_j_ch
                      JOIN users AS u ON b_i_j_ch.user_id = u.id
                      JOIN regions AS r ON u.region_id = r.id
                      JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j_ch.spravochnik_operatsii_id
                      LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_i_j_ch.id_spravochnik_podrazdelenie
                      LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_i_j_ch.id_spravochnik_sostav
                      LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_i_j_ch.id_spravochnik_type_operatsii
                      WHERE ${chhild_filter}  
                  ) AS b_i_j_ch
                ) AS childs
              FROM  bajarilgan_ishlar_jur3 AS b_i_j3 
              JOIN users AS u ON b_i_j3.user_id = u.id
              JOIN regions AS r ON u.region_id = r.id
              JOIN spravochnik_organization AS s_o ON s_o.id = b_i_j3.id_spravochnik_organization
              LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_i_j3.shartnomalar_organization_id
              WHERE ${filter} ORDER BY b_i_j3.doc_date OFFSET $5 LIMIT $6 
            )
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (
              SELECT COUNT(b_i_j3.id)::INTEGER AS total
              FROM bajarilgan_ishlar_jur3 AS b_i_j3 
              JOIN users AS u  ON b_i_j3.user_id = u.id
              JOIN regions AS r ON u.region_id = r.id
              WHERE ${filter}
            )::INTEGER total_count,
            (
              SELECT 
              SUM(b_i_j3.summa)::FLOAT AS summa
              FROM  bajarilgan_ishlar_jur3 AS b_i_j3 
              JOIN users AS u ON b_i_j3.user_id = u.id
              JOIN regions AS r ON u.region_id = r.id
              WHERE ${filter}
            )::FLOAT AS summa
          FROM data
        `,
      [main_schet_id, region_id, from, to, offset, limit],
    );
    return { data: rows[0]?.data || [], total: rows[0]?.total_count || 0, summa: rows[0]?.summa || 0 };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getElementByIdJur_3DB = async (region_id, main_schet_id, id, ignoreDeleted = false) => {
  try {
    let filter = `b_i_j3.main_schet_id = $2 AND r.id = $1 AND b_i_j3.id = $3`
    if (!ignoreDeleted) {
      filter += ` AND b_i_j3.isdeleted = false`;
    }
    const { rows } = await pool.query(`
        SELECT 
          b_i_j3.id, 
          b_i_j3.doc_num,
          TO_CHAR(b_i_j3.doc_date, 'YYYY-MM-DD') AS doc_date, 
          b_i_j3.opisanie, 
          b_i_j3.summa::FLOAT, 
          b_i_j3.id_spravochnik_organization,
          s_o.name AS spravochnik_organization_name,
          s_o.raschet_schet AS spravochnik_organization_raschet_schet,
          s_o.inn AS spravochnik_organization_inn, 
          b_i_j3.shartnomalar_organization_id,
          sh_o.doc_num AS shartnomalar_organization_doc_num,
          TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
          b_i_j3.spravochnik_operatsii_own_id,
          (
            SELECT ARRAY_AGG(row_to_json(b_i_j_ch))
            FROM (
                SELECT  
                  b_i_j_ch.id,
                  b_i_j_ch.bajarilgan_ishlar_jur3_id,
                  b_i_j_ch.spravochnik_operatsii_id,
                  s_o.name AS spravochnik_operatsii_name,
                  b_i_j_ch.summa::FLOAT,
                  b_i_j_ch.id_spravochnik_podrazdelenie,
                  s_p.name AS spravochnik_podrazdelenie_name,
                  b_i_j_ch.id_spravochnik_sostav,
                  s_s.name AS spravochnik_sostav_name,
                  b_i_j_ch.id_spravochnik_type_operatsii,
                  s_t_o.name AS spravochnik_type_operatsii_name
                FROM bajarilgan_ishlar_jur3_child AS b_i_j_ch
                JOIN users AS u ON b_i_j_ch.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j_ch.spravochnik_operatsii_id
                LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_i_j_ch.id_spravochnik_podrazdelenie
                LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_i_j_ch.id_spravochnik_sostav
                LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_i_j_ch.id_spravochnik_type_operatsii
                WHERE b_i_j_ch.bajarilgan_ishlar_jur3_id = b_i_j3.id
            ) AS b_i_j_ch
          ) AS childs
        FROM  bajarilgan_ishlar_jur3 AS b_i_j3 
        JOIN users AS u ON b_i_j3.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        JOIN spravochnik_organization AS s_o ON s_o.id = b_i_j3.id_spravochnik_organization
        LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_i_j3.shartnomalar_organization_id
        WHERE ${filter}
      `, [region_id, main_schet_id, id])
    if (!rows[0]) {
      throw new ErrorResponse('bajarilgan_ishlar_jur3 doc not found', 404)
    }
    return rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateJur3DB = async (data) => {
  try {
    const result = await pool.query(
      `
        UPDATE bajarilgan_ishlar_jur3
          SET 
            doc_num = $1, 
            doc_date = $2, 
            opisanie = $3, 
            summa = $4, 
            id_spravochnik_organization = $5, 
            shartnomalar_organization_id = $6, 
            spravochnik_operatsii_own_id = $7,
            updated_at = $8
          WHERE id = $9 RETURNING * 
          `,
      [
        data.doc_num,
        data.doc_date,
        data.opisanie,
        data.summa,
        data.id_spravochnik_organization,
        data.shartnomalar_organization_id,
        data.spravochnik_operatsii_own_id,
        tashkentTime(),
        data.id,
      ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteJur3ChildDB = async (id) => {
  try {
    await pool.query(`DELETE FROM bajarilgan_ishlar_jur3_child WHERE bajarilgan_ishlar_jur3_id = $1`, [id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteJur3DB = async (id) => {
  try {
    await pool.query(`UPDATE bajarilgan_ishlar_jur3 SET  isdeleted = true WHERE id = $1`, [id]);
    await pool.query(`UPDATE bajarilgan_ishlar_jur3_child SET isdeleted = true WHERE bajarilgan_ishlar_jur3_id = $1 AND isdeleted = false`, [id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const jur3CapService = async (region_id, from, to, schet) => {
  try {
    const data = await pool.query(`
      SELECT s_o.schet, s.smeta_number, COALESCE(SUM(b_i_j3_ch.summa::FLOAT), 0) AS summa
      FROM bajarilgan_ishlar_jur3 AS b_i_j3 
      JOIN bajarilgan_ishlar_jur3_child AS b_i_j3_ch ON b_i_j3_ch.bajarilgan_ishlar_jur3_id = b_i_j3.id
      JOIN spravochnik_operatsii AS s_own ON s_own.id = b_i_j3.spravochnik_operatsii_own_id
      JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j3_ch.spravochnik_operatsii_id
      JOIN users AS u ON u.id = b_i_j3.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN smeta AS s ON s.id = s_o.smeta_id
      WHERE b_i_j3.doc_date BETWEEN $1 AND $2 AND r.id = $3 AND s_own.schet = $4
      GROUP BY s_o.schet, s.smeta_number
    `, [from, to, region_id, schet])
    return data.rows
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getSchetService = async (region_id) => {
  try {
    const schets = await pool.query(`
      SELECT DISTINCT s_o.schet 
      FROM bajarilgan_ishlar_jur3 AS b_i_j3
      JOIN spravochnik_operatsii AS s_o  ON b_i_j3.spravochnik_operatsii_own_id = s_o.id
      JOIN users AS u ON u.id = b_i_j3.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE  r.id = $1 AND b_i_j3.isdeleted = false
    `, [region_id])
    return schets.rows
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  createJur3DB,
  createJur3ChildDB,
  getAllJur3DB,
  getElementByIdJur_3DB,
  deleteJur3ChildDB,
  updateJur3DB,
  deleteJur3DB,
  jur3CapService,
  getSchetService
};
