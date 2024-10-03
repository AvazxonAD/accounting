const { handleServiceError } = require("../../middleware/service.handle");
const pool = require("../../config/db");

const createJur3DB = handleServiceError(async (data) => {
  const result = await pool.query(
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
                created_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
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
      new Date(),
    ],
  );
  return result.rows[0];
});

const createJur3ChildDB = handleServiceError(async (data) => {
  await pool.query(
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
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
      new Date(),
    ],
  );
});

const getAllJur3DB = handleServiceError(
  async (region_id, main_schet_id, from, to, offset, limit) => {
    const result = await pool.query(
      ` 
            SELECT 
                bajarilgan_ishlar_jur3.id, 
                bajarilgan_ishlar_jur3.doc_num,
                TO_CHAR(bajarilgan_ishlar_jur3.doc_date, 'YYYY-MM-DD') AS doc_date, 
                bajarilgan_ishlar_jur3.opisanie, 
                bajarilgan_ishlar_jur3.summa::FLOAT, 
                bajarilgan_ishlar_jur3.id_spravochnik_organization,
                spravochnik_organization.name AS spravochnik_organization_name,
                spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
                spravochnik_organization.inn AS spravochnik_organization_inn, 
                bajarilgan_ishlar_jur3.shartnomalar_organization_id,
                shartnomalar_organization.doc_num AS shartnomalar_organization_doc_num,
                TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date
            FROM bajarilgan_ishlar_jur3 
            JOIN users ON bajarilgan_ishlar_jur3.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_organization ON spravochnik_organization.id = bajarilgan_ishlar_jur3.id_spravochnik_organization
            LEFT JOIN shartnomalar_organization ON shartnomalar_organization.id = bajarilgan_ishlar_jur3.shartnomalar_organization_id
            WHERE bajarilgan_ishlar_jur3.main_schet_id = $1 
                AND regions.id = $2 
                AND bajarilgan_ishlar_jur3.isdeleted = false
                AND bajarilgan_ishlar_jur3.doc_date BETWEEN $3 AND $4 
            OFFSET $5
            LIMIT $6
        `,
      [main_schet_id, region_id, from, to, offset, limit],
    );

    const total = await pool.query(
      `
        SELECT 
            COUNT(bajarilgan_ishlar_jur3.id)::INTEGER AS total
            FROM bajarilgan_ishlar_jur3 
            JOIN users ON bajarilgan_ishlar_jur3.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bajarilgan_ishlar_jur3.main_schet_id = $1 
                AND regions.id = $2 
                AND bajarilgan_ishlar_jur3.isdeleted = false
                AND bajarilgan_ishlar_jur3.doc_date BETWEEN $3 AND $4
    `,
      [main_schet_id, region_id, from, to],
    );

    const summa = await pool.query(
      `
        SELECT 
            SUM(bajarilgan_ishlar_jur3.summa)::FLOAT AS summa
            FROM bajarilgan_ishlar_jur3 
            JOIN users ON bajarilgan_ishlar_jur3.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bajarilgan_ishlar_jur3.main_schet_id = $1 
                AND regions.id = $2 
                AND bajarilgan_ishlar_jur3.isdeleted = false
                AND bajarilgan_ishlar_jur3.doc_date BETWEEN $3 AND $4
    `,
      [main_schet_id, region_id, from, to],
    );

    return {
      rows: result.rows,
      total: total.rows[0].total,
      summa: summa.rows[0].summa,
    };
  },
);

const getAllJur3ChildDB = handleServiceError(
  async (region_id, main_schet_id, jur3_id) => {
    const result = await pool.query(
      `
        SELECT  
            b_i_j_ch.id,
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
        JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_i_j_ch.id_spravochnik_podrazdelenie
        JOIN spravochnik_sostav AS s_s ON s_s.id = b_i_j_ch.id_spravochnik_sostav
        JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_i_j_ch.id_spravochnik_type_operatsii
        WHERE r.id = $1 
            AND b_i_j_ch.isdeleted = false 
            AND b_i_j_ch.main_schet_id = $2
            AND b_i_j_ch.bajarilgan_ishlar_jur3_id = $3
    `,
      [region_id, main_schet_id, jur3_id],
    );

    return result.rows;
  },
);

const getElementByIdJur_3DB = handleServiceError(
  async (region_id, main_schet_id, id, ignoreDeleted = false) => {
    let query = `
      SELECT 
          bajarilgan_ishlar_jur3.id, 
          bajarilgan_ishlar_jur3.doc_num,
          TO_CHAR(bajarilgan_ishlar_jur3.doc_date, 'YYYY-MM-DD') AS doc_date, 
          bajarilgan_ishlar_jur3.opisanie, 
          bajarilgan_ishlar_jur3.summa::FLOAT, 
          bajarilgan_ishlar_jur3.id_spravochnik_organization,
          spravochnik_organization.name AS spravochnik_organization_name,
          spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
          spravochnik_organization.inn AS spravochnik_organization_inn, 
          bajarilgan_ishlar_jur3.shartnomalar_organization_id,
          shartnomalar_organization.doc_num AS shartnomalar_organization_doc_num,
          TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date
      FROM bajarilgan_ishlar_jur3 
      JOIN users ON bajarilgan_ishlar_jur3.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      JOIN spravochnik_organization ON spravochnik_organization.id = bajarilgan_ishlar_jur3.id_spravochnik_organization
      LEFT JOIN shartnomalar_organization ON shartnomalar_organization.id = bajarilgan_ishlar_jur3.shartnomalar_organization_id
      WHERE bajarilgan_ishlar_jur3.main_schet_id = $1 
        AND regions.id = $2 
        AND bajarilgan_ishlar_jur3.id = $3
    `;

    if (!ignoreDeleted) {
      query += ` AND bajarilgan_ishlar_jur3.isdeleted = false`;
    }

    const result = await pool.query(query, [main_schet_id, region_id, id]);
    return result.rows[0];
  },
);


const updateJur3DB = handleServiceError(async (data) => {
  await pool.query(
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
                WHERE id = $9
        `,
    [
      data.doc_num,
      data.doc_date,
      data.opisanie,
      data.summa,
      data.id_spravochnik_organization,
      data.shartnomalar_organization_id,
      data.spravochnik_operatsii_own_id,
      new Date(),
      data.id,
    ],
  );
});

const deleteJur3ChildDB = handleServiceError(async (id) => {
  await pool.query(
    `
        UPDATE bajarilgan_ishlar_jur3_child SET isdeleted = true 
        WHERE bajarilgan_ishlar_jur3_id = $1 AND isdeleted = false
    `,
    [id],
  );
});

const deleteJur3DB = handleServiceError(async (id) => {
  await pool.query(
    `
        UPDATE bajarilgan_ishlar_jur3 
        SET  isdeleted = true
        WHERE id = $1
    `,
    [id],
  );
});

module.exports = {
  createJur3DB,
  createJur3ChildDB,
  getAllJur3DB,
  getAllJur3ChildDB,
  getElementByIdJur_3DB,
  deleteJur3ChildDB,
  updateJur3DB,
  deleteJur3DB,
};
