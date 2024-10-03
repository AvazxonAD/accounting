const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createShartnoma = handleServiceError(async (object) => {
  const shartnoma = await pool.query(
    `INSERT INTO shartnomalar_organization(
        doc_num, 
        doc_date, 
        summa, 
        opisanie, 
        smeta_id, 
        user_id, 
        smeta_2, 
        spravochnik_organization_id, 
        pudratchi_bool, 
        main_schet_id
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
    [
      object.doc_num,
      object.doc_date,
      object.summa,
      object.opisanie,
      object.smeta_id,
      object.user_id,
      object.smeta_2,
      object.spravochnik_organization_id,
      object.pudratchi_bool,
      object.main_schet_id,
    ],
  );
  return shartnoma.rows[0];
});

const getAllShartnoma = handleServiceError(
  async (region_id, main_schet_id, offset, limit) => {
    const result = await pool.query(
      `
        SELECT 
            shartnomalar_organization.id, 
            shartnomalar_organization.doc_num, 
            shartnomalar_organization.doc_date, 
            shartnomalar_organization.summa,
            shartnomalar_organization.opisanie,
            shartnomalar_organization.smeta_id,
            shartnomalar_organization.smeta_2,
            shartnomalar_organization.pudratchi_bool,
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.main_schet_id,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM shartnomalar_organization
        JOIN users  ON shartnomalar_organization.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE shartnomalar_organization.isdeleted = false 
            AND regions.id = $3
            AND shartnomalar_organization.main_schet_id = $4
        ORDER BY shartnomalar_organization.id
        OFFSET $1 
        LIMIT $2
    `,
      [offset, limit, region_id, main_schet_id],
    );
    return result.rows;
  },
);

const getTotalShartnoma = handleServiceError(
  async (region_id, main_schet_id) => {
    const result = await pool.query(
      `SELECT COUNT(shartnomalar_organization.id) AS total 
      FROM shartnomalar_organization 
      JOIN users  ON shartnomalar_organization.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE shartnomalar_organization.isdeleted = false 
        AND regions.id = $1
        AND shartnomalar_organization.main_schet_id = $2
    `,
      [region_id, main_schet_id],
    );
    return result.rows[0];
  },
);

const getByIdShartnomaDB = handleServiceError(
  async (region_id, main_schet_id, id) => {
    const result = await pool.query(
      `
        SELECT 
            shartnomalar_organization.id, 
            shartnomalar_organization.doc_num, 
            TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS doc_date, 
            shartnomalar_organization.summa,
            shartnomalar_organization.opisanie,
            shartnomalar_organization.smeta_id,
            shartnomalar_organization.smeta_2,
            shartnomalar_organization.pudratchi_bool,
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.main_schet_id,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn,
            shartnoma_grafik.year AS grafik_year
        FROM shartnomalar_organization
        JOIN users  ON shartnomalar_organization.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        JOIN shartnoma_grafik ON shartnoma_grafik.id_shartnomalar_organization = shartnomalar_organization.id 
        WHERE shartnomalar_organization.isdeleted = false 
            AND regions.id = $1
            AND shartnomalar_organization.main_schet_id = $2
            AND shartnomalar_organization.id = $3
    `,
      [region_id, main_schet_id, id],
    );
    return result.rows[0];
  },
);

const updateShartnomaDB = handleServiceError(async (object) => {
  await pool.query(
    `UPDATE shartnomalar_organization 
      SET 
        doc_num = $1, 
        doc_date = $2, 
        summa = $3, 
        opisanie = $4, 
        smeta_id = $5, 
        smeta_2 = $6, 
        spravochnik_organization_id = $7, 
        pudratchi_bool = $8
      WHERE id = $9
    `,
    [
      object.doc_num,
      object.doc_date,
      object.summa,
      object.opisanie,
      object.smeta_id,
      object.smeta_2,
      object.spravochnik_organization_id,
      object.pudratchi_bool,
      object.id,
    ],
  );
  await pool.query(
    `UPDATE shartnoma_grafik SET year = $1 WHERE id_shartnomalar_organization = $2`,
    [object.grafik_year, object.id],
  );
});

const deleteShartnomaDB = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE shartnoma_grafik SET isdeleted = $1 WHERE id_shartnomalar_organization = $2 AND isdeleted = false 
    `,
    [true, id],
  );

  await pool.query(
    `UPDATE shartnomalar_organization SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`,
    [true, id],
  );
});

const getByIdOrganizationShartnoma = handleServiceError(
  async (region_id, main_schet_id, organization_id) => {
    const result = await pool.query(
      `
        SELECT 
            shartnomalar_organization.id, 
            shartnomalar_organization.doc_num, 
            TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS doc_date, 
            shartnomalar_organization.summa,
            shartnomalar_organization.opisanie,
            shartnomalar_organization.smeta_id,
            shartnomalar_organization.smeta_2,
            shartnomalar_organization.pudratchi_bool,
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.main_schet_id,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM shartnomalar_organization
        JOIN users  ON shartnomalar_organization.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE shartnomalar_organization.isdeleted = false 
            AND regions.id = $1
            AND shartnomalar_organization.main_schet_id = $2
            AND shartnomalar_organization.spravochnik_organization_id = $3
        ORDER BY shartnomalar_organization.id
    `,
      [region_id, main_schet_id, organization_id],
    );
    return result.rows;
  },
);

const getByIdAndOrganizationIdShartnoma = handleServiceError(
  async (region_id, main_schet_id, id, organization_id) => {
    const result = await pool.query(
      `
        SELECT 
            shartnomalar_organization.* 
        FROM shartnomalar_organization
        JOIN users  ON shartnomalar_organization.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE shartnomalar_organization.isdeleted = false 
            AND regions.id = $1
            AND shartnomalar_organization.main_schet_id = $2
            AND shartnomalar_organization.id = $3
            AND shartnomalar_organization.spravochnik_organization_id = $4
    `,
      [region_id, main_schet_id, id, organization_id],
    );
    return result.rows[0];
  },
);

const forJur3DB = handleServiceError(async (region_id, main_schet_id) => {
    const result = await pool.query(
      `
        SELECT 
            shartnomalar_organization.id, 
            shartnomalar_organization.doc_num, 
            TO_CHAR(shartnomalar_organization.doc_date, 'YYYY-MM-DD') AS doc_date, 
            shartnomalar_organization.summa,
            shartnomalar_organization.opisanie,
            shartnomalar_organization.smeta_id,
            shartnomalar_organization.smeta_2,
            shartnomalar_organization.pudratchi_bool,
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.main_schet_id,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM shartnomalar_organization
        JOIN users  ON shartnomalar_organization.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE shartnomalar_organization.isdeleted = false 
            AND regions.id = $1
            AND shartnomalar_organization.main_schet_id = $2
            AND shartnomalar_organization.pudratchi_bool = true
    `,
      [region_id, main_schet_id],
    );
    return result.rows;
  },
);


module.exports = {
  createShartnoma,
  getAllShartnoma,
  getTotalShartnoma,
  getByIdShartnomaDB,
  updateShartnomaDB,
  getByIdOrganizationShartnoma,
  deleteShartnomaDB,
  getByIdAndOrganizationIdShartnoma,
  forJur3DB
};
