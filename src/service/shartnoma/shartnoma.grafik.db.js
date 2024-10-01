const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createShartnomaGrafik = handleServiceError(
  async (user_id, shartnoma_id) => {
    const result = await pool.query(
      `
      INSERT INTO shartnoma_grafik(id_shartnomalar_organization, user_id) VALUES($1, $2) 
    `,
      [shartnoma_id, user_id],
    );
  },
);

const getByIdGrafikDB = handleServiceError(
  async (region_id, main_schet_id, id) => {
    const result = await pool.query(
      `
    SELECT 
      shartnoma_grafik.id_shartnomalar_organization,
      shartnomalar_organization.doc_num, 
      shartnomalar_organization.doc_date, 
      shartnomalar_organization.summa,
      shartnomalar_organization.opisanie
      shartnoma_grafik.oy_1,
      shartnoma_grafik.oy_2,
      shartnoma_grafik.oy_3,
      shartnoma_grafik.oy_4,
      shartnoma_grafik.oy_5,
      shartnoma_grafik.oy_6,
      shartnoma_grafik.oy_7,
      shartnoma_grafik.oy_8,
      shartnoma_grafik.oy_9,
      shartnoma_grafik.oy_10,
      shartnoma_grafik.oy_11,
      shartnoma_grafik.oy_12,
      shartnoma_grafik.year,
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
      shartnoma_grafik.id_shartnomalar_organization,
      shartnomalar_organization.doc_num, 
      shartnomalar_organization.doc_date, 
      shartnomalar_organization.summa,
      shartnomalar_organization.opisanie,
      shartnoma_grafik.oy_1,
      shartnoma_grafik.oy_2,
      shartnoma_grafik.oy_3,
      shartnoma_grafik.oy_4,
      shartnoma_grafik.oy_5,
      shartnoma_grafik.oy_6,
      shartnoma_grafik.oy_7,
      shartnoma_grafik.oy_8,
      shartnoma_grafik.oy_9,
      shartnoma_grafik.oy_10,
      shartnoma_grafik.oy_11,
      shartnoma_grafik.oy_12,
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

module.exports = {
  createShartnomaGrafik,
  getByIdGrafikDB,
  getAllGrafikDB,
};
