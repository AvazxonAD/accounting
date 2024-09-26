const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByInnOrganization = handleServiceError(async (inn, user_id) => {
  const result = await pool.query(
    `SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2 AND isdeleted = false
    `,
    [inn, user_id],
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
},
);

const getAllOrganization = handleServiceError(
  async (user_id, offset, limit) => {
    result = await pool.query(
      `SELECT id, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, okonx
        FROM spravochnik_organization  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2
        LIMIT $3
    `,
      [user_id, offset, limit],
    );
    return result.rows;
  },
);

const totalOrganization = handleServiceError(async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM spravochnik_organization WHERE isdeleted = false AND user_id = $1`,
    [user_id],
  );
  return result.rows[0];
});

const getByIdOrganization = handleServiceError(async (user_id, id) => {
  const result = await pool.query(
    `SELECT id, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, okonx FROM spravochnik_organization WHERE  user_id = $1 AND id = $2 AND isdeleted = false `,
    [user_id, id],
  );
  return result.rows[0];
});

const updateOrganization = handleServiceError(async (object) => {
  await pool.query(
    `UPDATE spravochnik_organization 
        SET name = $1, bank_klient = $2, raschet_schet = $3, raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $9
        WHERE user_id = $7 AND id = $8
    `,
    [
      object.name,
      object.bank_klient,
      object.raschet_schet,
      object.raschet_schet_gazna,
      object.mfo,
      object.inn,
      object.user_id,
      object.id,
      object.okonx,
    ],
  );
},
);

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
