const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createShartnoma = handleServiceError(
  async (
    user_id,
    doc_num,
    doc_date,
    summa,
    opisanie,
    smeta_id,
    smeta_2,
    spravochnik_organization_id,
  ) => {
    const result = await pool.query(
      `INSERT INTO shartnomalar_organization(doc_num, doc_date, summa, opisanie, smeta_id, user_id, smeta_2, spravochnik_organization_id)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
      [
        doc_num,
        doc_date,
        summa,
        opisanie,
        smeta_id,
        user_id,
        smeta_2,
        spravochnik_organization_id,
      ],
    );
    return result.rows[0];
  },
);

const getAllShartnoma = handleServiceError(async (user_id, offset, limit) => {
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
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM 
            shartnomalar_organization
        JOIN 
            smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN 
            spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE 
            shartnomalar_organization.isdeleted = false 
            AND shartnomalar_organization.user_id = $3
        ORDER BY 
            shartnomalar_organization.id
        OFFSET $1 
        LIMIT $2
    `,
    [offset, limit, user_id],
  );
  return result.rows;
});

const getTotalShartnoma = handleServiceError(async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM shartnomalar_organization WHERE isdeleted = false AND  user_id = $1`,
    [user_id],
  );
  return result.rows[0];
});

const getByIdShartnoma = handleServiceError(async (user_id, id) => {
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
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM 
            shartnomalar_organization
        JOIN 
            smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN 
            spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE 
            shartnomalar_organization.isdeleted = false 
            AND shartnomalar_organization.user_id = $1
            AND shartnomalar_organization.id = $2
        ORDER BY 
            shartnomalar_organization.id
    `,
    [user_id, id],
  );
  return result.rows[0];
});

const updateShartnoma = handleServiceError(
  async (
    id,
    doc_num,
    doc_date,
    summa,
    opisanie,
    smeta_id,
    smeta_2,
    spravochnik_organization_id,
  ) => {
    let result = await pool.query(
      `UPDATE shartnomalar_organization SET 
            doc_num = $1, 
            doc_date = $2, 
            summa = $3, 
            opisanie = $4, 
            smeta_id = $5, 
            smeta_2 = $6, 
            spravochnik_organization_id = $7
        WHERE id = $8
        RETURNING *
    `,
      [
        doc_num,
        doc_date,
        summa,
        opisanie,
        smeta_id,
        smeta_2,
        spravochnik_organization_id,
        id,
      ],
    );
    return result.rows[0];
  },
);

const deleteShartnoma = handleServiceError(async () => {
  const grafik = await pool.query(
    `UPDATE shartnoma_grafik SET isdeleted = $1 WHERE id_shartnomalar_organization = $2 AND isdeleted = false RETURNING * 
    `,
    [true, id_shartnomalar_organization],
  );

  const result = await pool.query(`UPDATE SET `);
});

module.exports = {
  createShartnoma,
  getAllShartnoma,
  getTotalShartnoma,
  getByIdShartnoma,
  updateShartnoma,
};
