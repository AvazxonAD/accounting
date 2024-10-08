const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const ErrorResponse = require("../../utils/errorResponse");

const createShartnomaGrafik = handleServiceError(
  async (user_id, shartnoma_id, main_schet_id, year) => {
    await pool.query(
      `
      INSERT INTO shartnoma_grafik(id_shartnomalar_organization, user_id, main_schet_id, year) VALUES($1, $2, $3, $4) 
    `,
      [shartnoma_id, user_id, main_schet_id, year],
    );
  },
);

const getByIdGrafikDB = handleServiceError(
  async (region_id, main_schet_id, id, ignoreDeleted = false) => {
    let query = `
      SELECT 
        shartnoma_grafik.id,
        shartnoma_grafik.id_shartnomalar_organization,
        shartnomalar_organization.doc_num, 
        TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS doc_date, 
        shartnomalar_organization.summa::FLOAT,
        shartnomalar_organization.opisanie,
        shartnoma_grafik.oy_1::FLOAT,
        shartnoma_grafik.oy_2::FLOAT,
        shartnoma_grafik.oy_3::FLOAT,
        shartnoma_grafik.oy_4::FLOAT,
        shartnoma_grafik.oy_5::FLOAT,
        shartnoma_grafik.oy_6::FLOAT,
        shartnoma_grafik.oy_7::FLOAT,
        shartnoma_grafik.oy_8::FLOAT,
        shartnoma_grafik.oy_9::FLOAT,
        shartnoma_grafik.oy_10::FLOAT,
        shartnoma_grafik.oy_11::FLOAT,
        shartnoma_grafik.oy_12::FLOAT,
        shartnoma_grafik.year
      FROM shartnoma_grafik
      JOIN users  ON shartnoma_grafik.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      JOIN shartnomalar_organization ON shartnomalar_organization.id = shartnoma_grafik.id_shartnomalar_organization
      WHERE regions.id = $1
        AND shartnoma_grafik.main_schet_id = $2
        AND shartnoma_grafik.id = $3
    `;

    if (!ignoreDeleted) {
      query += ` AND shartnoma_grafik.isdeleted = false`;
    }

    query += ` ORDER BY shartnoma_grafik.id`;

    const result = await pool.query(query, [region_id, main_schet_id, id]);
    return result.rows[0];
  },
);


const getAllGrafikDB = async (region_id, main_schet_id, organization) => {
  try {
    let organization_filter = '';
const params = [region_id, main_schet_id];

if (organization) {
    organization_filter = `AND s_o.id = $${params.length + 1}`;
    params.push(organization);
}

const result = await pool.query(
    `
    SELECT
      s_o.name AS spravochnik_organization_name,
      s_o.bank_klient AS spravochnik_organization_bank_klient,
      s_o.mfo AS spravochnik_organization_mfo,
      s_o.inn AS spravochnik_organization_inn,
      s_o.raschet_schet AS spravochnik_organization_raschet_schet,
      sh_g.id_shartnomalar_organization,
      sh_o.doc_num AS shartnomalar_organization_doc_num,
      TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
      sh_o.opisanie AS shartnomalar_organization_opisanie,
      sh_o.summa::FLOAT AS shartnomalar_organization_summa,
      sh_o.pudratchi_bool AS shartnomalar_organization_pudratchi_bool,
      sh_g.id,
      sh_g.oy_1::FLOAT,
      sh_g.oy_2::FLOAT,
      sh_g.oy_3::FLOAT,
      sh_g.oy_4::FLOAT,
      sh_g.oy_5::FLOAT,
      sh_g.oy_6::FLOAT,
      sh_g.oy_7::FLOAT,
      sh_g.oy_8::FLOAT,
      sh_g.oy_9::FLOAT,
      sh_g.oy_10::FLOAT,
      sh_g.oy_11::FLOAT,
      sh_g.oy_12::FLOAT,
      sh_g.year
    FROM shartnoma_grafik AS sh_g
    JOIN users AS u ON sh_g.user_id = u.id
    JOIN regions AS r ON u.region_id = r.id
    JOIN shartnomalar_organization AS sh_o ON sh_o.id = sh_g.id_shartnomalar_organization
    JOIN spravochnik_organization AS s_o ON s_o.id = sh_o.spravochnik_organization_id
    WHERE sh_g.isdeleted = false 
        AND r.id = $1
        AND sh_g.main_schet_id = $2 ${organization_filter}
    ORDER BY sh_o.doc_date DESC
    `,
    params
);
  
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateShartnomaGrafikDB = handleServiceError(async (data) => {
  await pool.query(
    `
    UPDATE shartnoma_grafik SET 
      oy_1 = $1,
      oy_2 = $2,
      oy_3 = $3,
      oy_4 = $4,
      oy_5 = $5,
      oy_6 = $6,
      oy_7 = $7,
      oy_8 = $8,
      oy_9 = $9,
      oy_10 = $10,
      oy_11 = $11,
      oy_12 = $12
  `,
    [
      data.oy_1,
      data.oy_2,
      data.oy_3,
      data.oy_4,
      data.oy_5,
      data.oy_6,
      data.oy_7,
      data.oy_8,
      data.oy_9,
      data.oy_10,
      data.oy_11,
      data.oy_12,
    ],
  );
});

module.exports = {
  createShartnomaGrafik,
  getByIdGrafikDB,
  getAllGrafikDB,
  updateShartnomaGrafikDB,
};
