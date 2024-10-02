const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

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
  async (region_id, main_schet_id, id) => {
    const result = await pool.query(
      `
    SELECT 
      shartnoma_grafik.id,
      shartnoma_grafik.id_shartnomalar_organization,
      shartnomalar_organization.doc_num, 
      TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS doc_date, 
      shartnomalar_organization.summa::FLOAT ,
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
    WHERE shartnoma_grafik.isdeleted = false 
        AND regions.id = $1
        AND shartnoma_grafik.main_schet_id = $2
        AND shartnoma_grafik.id = $3
    ORDER BY shartnoma_grafik.id
  `,
      [region_id, main_schet_id, id],
    );
    return result.rows[0];
  },
);

const getAllGrafikDB = handleServiceError(async (region_id, main_schet_id) => {
  const result = await pool.query(
    `
    SELECT
    shartnoma_grafik.id,  
      shartnoma_grafik.id_shartnomalar_organization,
      shartnomalar_organization.doc_num, 
      TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS doc_date, 
      shartnomalar_organization.summa::FLOAT ,
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
    WHERE shartnoma_grafik.isdeleted = false 
        AND regions.id = $1
        AND shartnoma_grafik.main_schet_id = $2
    ORDER BY shartnoma_grafik.id
  `,
    [region_id, main_schet_id],
  );

  return result.rows;
});

const updateShartnomaGrafikDB = handleServiceError(async (object) => {
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
      object.oy_1,
      object.oy_2,
      object.oy_3,
      object.oy_4,
      object.oy_5,
      object.oy_6,
      object.oy_7,
      object.oy_8,
      object.oy_9,
      object.oy_10,
      object.oy_11,
      object.oy_12,
    ],
  );
});

module.exports = {
  createShartnomaGrafik,
  getByIdGrafikDB,
  getAllGrafikDB,
  updateShartnomaGrafikDB,
};
