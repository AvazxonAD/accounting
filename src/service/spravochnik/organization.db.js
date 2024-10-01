const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByInnOrganization = handleServiceError(async (inn, region_id) => {
  const result = await pool.query(
    `SELECT * 
    FROM spravochnik_organization
    JOIN users ON spravochnik_organization.user_id = users.id
    JOIN regions ON users.region_id = regions.id 
    WHERE spravochnik_organization.inn = $1 AND 
    regions.id = $2 AND spravochnik_organization.isdeleted = false
    `,
    [inn, region_id],
  );
  return result.rows[0];
});

const createOrganization = handleServiceError(async (object) => {
  const result = await pool.query(
    `INSERT INTO spravochnik_organization(
        name, bank_klient, raschet_schet, 
        raschet_schet_gazna, mfo, inn, user_id, okonx
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
    `,
    [
      object.name,
      object.bank_klient,
      object.raschet_schet,
      object.raschet_schet_gazna,
      object.mfo,
      object.inn,
      object.user_id,
      object.okonx,
    ],
  );
  return result.rows[0];
});

const getAllOrganization = handleServiceError(
  async (region_id, offset, limit) => {
    result = await pool.query(
      `SELECT 
          spravochnik_organization.id, 
          spravochnik_organization.name, 
          spravochnik_organization.bank_klient, 
          spravochnik_organization.raschet_schet, 
          spravochnik_organization.raschet_schet_gazna, 
          spravochnik_organization.mfo, 
          spravochnik_organization.inn, 
          spravochnik_organization.okonx 
        FROM spravochnik_organization  
        JOIN users ON spravochnik_organization.user_id = users.id
        JOIN regions ON users.region_id = regions.id 
        WHERE spravochnik_organization.isdeleted = false 
          AND regions.id = $1 
          ORDER BY id
        OFFSET $2
        LIMIT $3
    `,
      [region_id, offset, limit],
    );
    return result.rows;
  },
);

const totalOrganization = handleServiceError(async (region_id) => {
  const result = await pool.query(
    `SELECT COUNT(spravochnik_organization.id) AS total 
    FROM spravochnik_organization 
    JOIN users ON spravochnik_organization.user_id = users.id
    JOIN regions ON users.region_id = regions.id
    WHERE spravochnik_organization.isdeleted = false 
    AND regions.id = $1`,
    [region_id],
  );
  return result.rows[0];
});

const getByIdOrganization = handleServiceError(async (region_id, id) => {
  const result = await pool.query(
    `SELECT 
          spravochnik_organization.id, 
          spravochnik_organization.name, 
          spravochnik_organization.bank_klient, 
          spravochnik_organization.raschet_schet, 
          spravochnik_organization.raschet_schet_gazna, 
          spravochnik_organization.mfo, 
          spravochnik_organization.inn, 
          spravochnik_organization.okonx  
      FROM spravochnik_organization 
      JOIN users ON spravochnik_organization.user_id = users.id
      JOIN regions ON users.region_id = regions.id 
      WHERE  regions.id = $1 
        AND spravochnik_organization.id = $2 
        AND spravochnik_organization.isdeleted = false `,
    [region_id, id],
  );
  return result.rows[0];
});

const updateOrganization = handleServiceError(async (object) => {
  await pool.query(
    `UPDATE spravochnik_organization 
        SET name = $1, bank_klient = $2, raschet_schet = $3, raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $7
        WHERE id = $8 AND isdeleted = false
    `,
    [
      object.name,
      object.bank_klient,
      object.raschet_schet,
      object.raschet_schet_gazna,
      object.mfo,
      object.inn,
      object.okonx,
      object.id,
    ],
  );
});

const deleteOrganization = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE spravochnik_organization SET isdeleted = $1 WHERE id = $2`,
    [true, id],
  );
});

module.exports = {
  getByInnOrganization,
  createOrganization,
  getAllOrganization,
  totalOrganization,
  getByIdOrganization,
  updateOrganization,
  deleteOrganization,
};
