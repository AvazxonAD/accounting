const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAllSmetaGrafik = handleServiceError(
  async (region_id, smeta_id, spravochnik_budjet_name_id, year) => {
    const result = await pool.query(
      `   SELECT smeta_grafik.* 
            FROM smeta_grafik
            JOIN users ON smeta_grafik.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE smeta_grafik.smeta_id = $1 
                AND smeta_grafik.spravochnik_budjet_name_id = $2 
                AND smeta_grafik.isdeleted = false 
                AND regions.id = $3
                AND smeta_grafik.year = $4
        `,
      [smeta_id, spravochnik_budjet_name_id, region_id, year],
    );
    return result.rows[0];
  },
);

const createSmetaGrafik = handleServiceError(
  async (user_id, smeta_id, spravochnik_budjet_name_id, year) => {
    await pool.query(
      `INSERT INTO smeta_grafik(smeta_id, spravochnik_budjet_name_id, user_id, year) VALUES($1, $2, $3, $4)
        `,
      [smeta_id, spravochnik_budjet_name_id, user_id, year],
    );
  },
);

const getAllSmetaGrafik = handleServiceError(
  async (region_id, offset, limit) => {
    const result = await pool.query(
      `SELECT 
                smeta_grafik.id, 
                smeta_grafik.smeta_id, 
                smeta.smeta_name,
                smeta_grafik.spravochnik_budjet_name_id,
                spravochnik_budjet_name.name AS budjet_name,
                smeta_grafik.itogo,
                smeta_grafik.oy_1,
                smeta_grafik.oy_2,
                smeta_grafik.oy_3,
                smeta_grafik.oy_4,
                smeta_grafik.oy_5,
                smeta_grafik.oy_6,
                smeta_grafik.oy_7,
                smeta_grafik.oy_8,
                smeta_grafik.oy_9,
                smeta_grafik.oy_10,
                smeta_grafik.oy_11,
                smeta_grafik.oy_12,
                smeta_grafik.year
            FROM smeta_grafik
            JOIN users ON smeta_grafik.user_id = users.id
            JOIN regions ON regions.id = users.region_id  
            JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = smeta_grafik.spravochnik_budjet_name_id
            JOIN smeta ON smeta.id = smeta_grafik.smeta_id
            WHERE smeta_grafik.isdeleted = false AND regions.id = $1
            OFFSET $2
            LIMIT $3
        `,
      [region_id, offset, limit],
    );
    return result.rows;
  },
);

const getElementByIdGrafik = handleServiceError(async (region_id, id, ignoreDeleted = false) => {
  let query = `
    SELECT 
        smeta_grafik.id, 
        smeta_grafik.smeta_id, 
        smeta.smeta_name,
        smeta_grafik.spravochnik_budjet_name_id,
        spravochnik_budjet_name.name AS budjet_name,
        smeta_grafik.itogo,
        smeta_grafik.oy_1,
        smeta_grafik.oy_2,
        smeta_grafik.oy_3,
        smeta_grafik.oy_4,
        smeta_grafik.oy_5,
        smeta_grafik.oy_6,
        smeta_grafik.oy_7,
        smeta_grafik.oy_8,
        smeta_grafik.oy_9,
        smeta_grafik.oy_10,
        smeta_grafik.oy_11,
        smeta_grafik.oy_12,
        smeta_grafik.year
    FROM smeta_grafik
    JOIN users ON smeta_grafik.user_id = users.id
    JOIN regions ON users.region_id = regions.id  
    JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = smeta_grafik.spravochnik_budjet_name_id
    JOIN smeta ON smeta.id = smeta_grafik.smeta_id
    WHERE regions.id = $1 AND smeta_grafik.id = $2
  `;

  if (!ignoreDeleted) {
    query += ` AND smeta_grafik.isdeleted = false`;
  }

  const result = await pool.query(query, [region_id, id]);
  return result.rows[0];
});


const updateSmetaGrafikDB = handleServiceError(async (data) => {
  await pool.query(
    `UPDATE  smeta_grafik 
            SET 
                itogo = $1,
                oy_1 = $2,
                oy_2 = $3,
                oy_3 = $4,
                oy_4 = $5,
                oy_5 = $6,
                oy_6 = $7,
                oy_7 = $8,
                oy_8 = $9,
                oy_9 = $10,
                oy_10 = $11,
                oy_11 = $12,
                oy_12 = $13
            WHERE  id = $14 AND isdeleted = false
        `,
    [
      data.itogo,
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
      data.id,
    ],
  );
});

const deleteSmetaGrafik = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE smeta_grafik SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`,
    [true, id],
  );
});

module.exports = {
  getByAllSmetaGrafik,
  createSmetaGrafik,
  getAllSmetaGrafik,
  getElementByIdGrafik,
  updateSmetaGrafikDB,
  deleteSmetaGrafik,
};
