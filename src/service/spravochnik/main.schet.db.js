const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByIdMainSchet = handleServiceError(async (region_id, id) => {
  const result = await pool.query(
    `SELECT 
                main_schet.id, 
                main_schet.account_number, 
                main_schet.spravochnik_budjet_name_id, 
                main_schet.tashkilot_nomi, 
                main_schet.tashkilot_bank, 
                main_schet.tashkilot_mfo, 
                main_schet.tashkilot_inn, 
                main_schet.account_name, 
                main_schet.jur1_schet, 
                main_schet.jur1_subschet,
                main_schet.jur2_schet, 
                main_schet.jur2_subschet,
                main_schet.jur3_schet,
                main_schet.jur3_subschet, 
                main_schet.jur4_schet,
                main_schet.jur4_subschet, 
                spravochnik_budjet_name.name AS budjet_name
            FROM main_schet
            JOIN users ON main_schet.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_budjet_name 
                ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
            WHERE main_schet.isdeleted = false 
                AND regions.id = $1 
                AND main_schet.id = $2
    `,
    [region_id, id],
  );
  return result.rows[0];
});

const createMain_schet = handleServiceError(async (object) => {
  await pool.query(
    `   INSERT INTO main_schet(
        account_number,
        spravochnik_budjet_name_id,
        tashkilot_nomi,
        tashkilot_bank,
        tashkilot_mfo,
        tashkilot_inn,
        account_name,
        jur1_schet,
        jur1_subschet,
        jur2_schet,
        jur2_subschet,
        jur3_schet,
        jur3_subschet,
        jur4_subschet,
        jur4_schet,
        user_id
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
    `,
    [
      object.account_number,
      object.spravochnik_budjet_name_id,
      object.tashkilot_nomi,
      object.tashkilot_bank,
      object.tashkilot_mfo,
      object.tashkilot_inn,
      object.account_name,
      object.jur1_schet,
      object.jur1_subschet,
      object.jur2_schet,
      object.jur2_subschet,
      object.jur3_schet,
      object.jur3_subschet,
      object.jur4_subschet,
      object.jur4_schet,
      object.user_id,
    ],
  );
});

const getAllMain_schet = handleServiceError(
  async (region_id, offset, limit) => {
    const result = await pool.query(
      `
        SELECT 
            main_schet.id, 
            main_schet.user_id,
            main_schet.account_number, 
            main_schet.spravochnik_budjet_name_id, 
            main_schet.tashkilot_nomi, 
            main_schet.tashkilot_bank, 
            main_schet.tashkilot_mfo, 
            main_schet.tashkilot_inn, 
            main_schet.account_name, 
            main_schet.jur1_schet, 
            main_schet.jur1_subschet,
            main_schet.jur2_schet, 
            main_schet.jur2_subschet,
            main_schet.jur3_schet,
            main_schet.jur3_subschet, 
            main_schet.jur4_schet,
            main_schet.jur4_subschet, 
            spravochnik_budjet_name.name AS budjet_name,
            spravochnik_budjet_name.id AS spravochnik_budjet_name_id 
        FROM main_schet
        JOIN users ON main_schet.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN spravochnik_budjet_name 
            ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
        WHERE main_schet.isdeleted = false 
            AND regions.id = $1
        ORDER BY main_schet.id
        OFFSET $2
        LIMIT $3
    `,
      [region_id, offset, limit],
    );

    const totalQuery = await pool.query(
      `
        SELECT 
          COUNT(main_schet.id)
        FROM main_schet
        JOIN users ON main_schet.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE main_schet.isdeleted = false 
          AND regions.id = $1
    `,
      [region_id],
    );

    return { main_schet_rows: result.rows, total: totalQuery.rows[0] };
  },
);

const updateMain_schet = handleServiceError(async (object) => {
  await pool.query(
    `UPDATE  main_schet SET 
        account_number = $1, 
        spravochnik_budjet_name_id = $2, 
        tashkilot_nomi = $3, 
        tashkilot_bank = $4, 
        tashkilot_mfo = $5, 
        tashkilot_inn = $6, 
        account_name = $7, 
        jur1_schet = $8, 
        jur1_subschet = $9, 
        jur2_schet = $10, 
        jur2_subschet = $11, 
        jur3_schet = $12, 
        jur3_subschet = $13, 
        jur4_subschet = $14, 
        jur4_schet = $15
        WHERE id = $16
    `,
    [
      object.account_number,
      object.spravochnik_budjet_name_id,
      object.tashkilot_nomi,
      object.tashkilot_bank,
      object.tashkilot_mfo,
      object.tashkilot_inn,
      object.account_name,
      object.jur1_schet,
      object.jur1_subschet,
      object.jur2_schet,
      object.jur2_subschet,
      object.jur3_schet,
      object.jur3_subschet,
      object.jur4_subschet,
      object.jur4_schet,
      object.id,
    ],
  );
});

const deleteMain_schet = handleServiceError(async (id) => {
  await pool.query(`UPDATE main_schet SET isdeleted = $1 WHERE id = $2`, [
    true,
    id,
  ]);
});

const getByBudjet_idMain_schet = handleServiceError(async (id, region_id) => {
  const result = await pool.query(
    `
      SELECT 
        main_schet.id AS main_schet_id, 
        main_schet.account_number 
      FROM main_schet 
      JOIN users ON main_schet.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE spravochnik_budjet_name_id = $1 
        AND isdeleted = false
    `,

    [id],
  );
  return result.rows;
});

module.exports = {
  getByIdMainSchet,
  createMain_schet,
  getAllMain_schet,
  updateMain_schet,
  deleteMain_schet,
  getByBudjet_idMain_schet,
};
