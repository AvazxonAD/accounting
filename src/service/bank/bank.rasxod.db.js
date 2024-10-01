const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createBankRasxodDb = handleServiceError(async (object) => {
  const result = await pool.query(
    `
            INSERT INTO bank_rasxod(
                doc_num, 
                doc_date, 
                summa, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id,
                spravochnik_operatsii_own_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
            `,
    [
      object.doc_num,
      object.doc_date,
      object.summa,
      object.opisanie,
      object.id_spravochnik_organization,
      object.id_shartnomalar_organization,
      object.main_schet_id,
      object.user_id,
      object.spravochnik_operatsii_own_id,
    ],
  );
  return result.rows[0];
});

const createBankRasxodChild = handleServiceError(async (object) => {
  await pool.query(
    `
              INSERT INTO bank_rasxod_child(
                  spravochnik_operatsii_id,
                  summa,
                  id_spravochnik_podrazdelenie,
                  id_spravochnik_sostav,
                  id_spravochnik_type_operatsii,
                  own_schet,
                  own_subschet,
                  main_schet_id,
                  id_bank_rasxod,
                  user_id,
                  spravochnik_operatsii_own_id
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      object.spravochnik_operatsii_id,
      object.summa,
      object.id_spravochnik_podrazdelenie,
      object.id_spravochnik_sostav,
      object.id_spravochnik_type_operatsii,
      object.jur2_schet,
      object.jur2_subschet,
      object.main_schet_id,
      object.rasxod_id,
      object.user_id,
      object.spravochnik_operatsii_own_id,
    ],
  );
});

const getByIdRasxod = handleServiceError(
  async (region_id, main_schet_id, id) => {
    const result = await pool.query(
      ` SELECT bank_rasxod.* 
      FROM bank_rasxod 
      JOIN users ON bank_rasxod.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE bank_rasxod.id = $1 
        AND regions.id = $2 
        AND bank_rasxod.main_schet_id = $3 
        AND bank_rasxod.isdeleted = false
    `,
      [id, region_id, main_schet_id],
    );
    return result.rows[0];
  },
);

const updateRasxod = handleServiceError(async (object) => {
  await pool.query(
    `
            UPDATE bank_rasxod SET 
                doc_num = $1, 
                doc_date = $2, 
                summa = $3, 
                opisanie = $4, 
                id_spravochnik_organization = $5, 
                id_shartnomalar_organization = $6,
                spravochnik_operatsii_own_id = $7
            WHERE id = $8
            RETURNING * 
            `,
    [
      object.doc_num,
      object.doc_date,
      object.summa,
      object.opisanie,
      object.id_spravochnik_organization,
      object.id_shartnomalar_organization,
      object.spravochnik_operatsii_own_id,
      object.id,
    ],
  );
});

const getAllBankRasxodByFromAndTo = handleServiceError(
  async (region_id, main_schet_id, offset, limit, from, to) => {
    const result = await pool.query(
      `
            SELECT
                bank_rasxod.id,
                bank_rasxod.doc_num, 
                TO_CHAR(bank_rasxod.doc_date, 'YYYY-MM-DD') AS doc_date, 
                bank_rasxod.summa, 
                bank_rasxod.opisanie, 
                bank_rasxod.id_spravochnik_organization,
                spravochnik_organization.name AS spravochnik_organization_name,
                spravochnik_organization.okonx AS spravochnik_organization_okonx,
                spravochnik_organization.bank_klient AS spravochnik_organization_bank_klient,
                spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
                spravochnik_organization.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                spravochnik_organization.mfo AS spravochnik_organization_mfo,
                spravochnik_organization.inn AS spravochnik_organization_inn, 
                bank_rasxod.id_shartnomalar_organization
            FROM bank_rasxod 
            JOIN users ON bank_rasxod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_organization ON spravochnik_organization.id = bank_rasxod.id_spravochnik_organization 
            WHERE bank_rasxod.main_schet_id = $1 
                AND regions.id = $2 
                AND bank_rasxod.isdeleted = false 
                AND bank_rasxod.doc_date BETWEEN $3 AND $4
            OFFSET $5 
            LIMIT $6
        `,
      [main_schet_id, region_id, from, to, offset, limit], // $3: from, $4: to
    );

    const summa = await pool.query(
      `
                SELECT SUM(bank_rasxod.summa) AS sum
                FROM bank_rasxod 
                JOIN users ON bank_rasxod.user_id = users.id
                JOIN regions ON users.region_id = regions.id
                WHERE bank_rasxod.main_schet_id = $1 AND regions.id = $2 AND bank_rasxod.isdeleted = false AND bank_rasxod.doc_date BETWEEN $3 AND $4
        `,
      [main_schet_id, region_id, from, to], // $3: from, $4: to
    );

    const totalQuery = await pool.query(
      `
                SELECT COUNT(bank_rasxod.id) AS count
                FROM bank_rasxod 
                JOIN users ON bank_rasxod.user_id = users.id
                JOIN regions ON users.region_id = regions.id
                WHERE bank_rasxod.main_schet_id = $1 AND regions.id = $2 AND bank_rasxod.isdeleted = false AND bank_rasxod.doc_date BETWEEN $3 AND $4
        `,
      [main_schet_id, region_id, from, to], // $3: from, $4: to
    );

    return {
      rasxod_rows: result.rows,
      summa: summa.rows[0].sum,
      totalQuery: totalQuery.rows[0],
    };
  },
);

const getAllRasxodChildDb = handleServiceError(async (region_id, rasxod_id) => {
  const result = await pool.query(
    `
              SELECT  
                  bank_rasxod_child.id,
                  bank_rasxod_child.spravochnik_operatsii_id,
                  spravochnik_operatsii.name AS spravochnik_operatsii_name,
                  bank_rasxod_child.summa,
                  bank_rasxod_child.id_spravochnik_podrazdelenie,
                  spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                  bank_rasxod_child.id_spravochnik_sostav,
                  spravochnik_sostav.name AS spravochnik_sostav_name,
                  bank_rasxod_child.id_spravochnik_type_operatsii,
                  spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                  bank_rasxod_child.own_schet,
                  bank_rasxod_child.own_subschet
              FROM bank_rasxod_child 
              JOIN users ON bank_rasxod_child.user_id = users.id
              JOIN regions ON users.region_id = regions.id
              JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_rasxod_child.spravochnik_operatsii_id
              JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_rasxod_child.id_spravochnik_podrazdelenie
              JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_rasxod_child.id_spravochnik_sostav
              JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_rasxod_child.id_spravochnik_type_operatsii
              WHERE regions.id = $1 AND bank_rasxod_child.isdeleted = false AND bank_rasxod_child.id_bank_rasxod = $2
          `,
    [region_id, rasxod_id],
  );
  return result.rows;
});

const getElemenByIdRasxod = handleServiceError(
  async (region_id, main_schet_id, id) => {
    let result = await pool.query(
      `
            SELECT 
                bank_rasxod.id,
                bank_rasxod.doc_num, 
                TO_CHAR(bank_rasxod.doc_date, 'YYYY-MM-DD') AS doc_date, 
                bank_rasxod.summa, 
                bank_rasxod.opisanie, 
                bank_rasxod.id_spravochnik_organization, 
                bank_rasxod.id_shartnomalar_organization,
                bank_rasxod.id_shartnomalar_organization,
                bank_rasxod.spravochnik_operatsii_own_id
            FROM bank_rasxod 
            JOIN users ON bank_rasxod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_rasxod.main_schet_id = $1 
              AND regions.id = $2 
              AND bank_rasxod.isdeleted = false 
              AND bank_rasxod.id = $3
        `,
      [main_schet_id, region_id, id],
    );
    return result.rows[0];
  },
);

const getElemenByIdRasxodChild = handleServiceError(
  async (region_id, rasxod_id) => {
    const result = await pool.query(
      `SELECT  
            bank_rasxod_child.spravochnik_operatsii_id,
            bank_rasxod_child.summa,
            bank_rasxod_child.id_spravochnik_podrazdelenie,
            bank_rasxod_child.id_spravochnik_sostav,
            bank_rasxod_child.id_spravochnik_type_operatsii
        FROM bank_rasxod_child 
        JOIN users ON bank_rasxod_child.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE regions.id = $1 
          AND bank_rasxod_child.isdeleted = false 
          AND bank_rasxod_child.id_bank_rasxod = $2
    `,
      [region_id, rasxod_id],
    );
    return result.rows;
  },
);

const deleteRasxodChild = handleServiceError(async (id) => {
  await pool.query(
    ` UPDATE  bank_rasxod_child
        SET isdeleted = $2
        WHERE id_bank_rasxod = $1 AND isdeleted = false 
      `,
    [id, true],
  );
});

const deleteBankRasxod = handleServiceError(async (id) => {
  await pool.query(
    ` 
        UPDATE bank_rasxod 
        SET isdeleted = $2
        WHERE id = $1 AND isdeleted = false 
      `,
    [id, true],
  );
});

module.exports = {
  createBankRasxodDb,
  createBankRasxodChild,
  getByIdRasxod,
  updateRasxod,
  getAllRasxodChildDb,
  getAllBankRasxodByFromAndTo,
  getElemenByIdRasxod,
  getElemenByIdRasxodChild,
  deleteRasxodChild,
  deleteBankRasxod,
};
