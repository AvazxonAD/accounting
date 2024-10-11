const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const getByInnOrganizationService = async (inn, region_id) => {
  try {
    const result = await pool.query(
      `SELECT 
          id, name, bank_klient, raschet_schet, 
          raschet_schet_gazna, mfo, inn, okonx
        FROM spravochnik_organization AS s_o
        JOIN users AS u ON s_o.user_id = u.id
        JOIN regions  AS ON u.region_id = r.id 
        WHERE s_o.inn = $1 AND 
        r.id = $2 AND s_o.isdeleted = false
    `, [inn, region_id]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createOrganizationService = async (data) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_organization(
          name, bank_klient, raschet_schet, 
          raschet_schet_gazna, mfo, inn, user_id, okonx
          ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING *
      `, [
      data.name,
      data.bank_klient,
      data.raschet_schet,
      data.raschet_schet_gazna,
      data.mfo,
      data.inn,
      data.user_id,
      data.okonx,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllOrganizationService = async (region_id, offset, limit, inn) => {
  try {
    const params =  [region_id, offset, limit]
    let innFilter = ``
    if (inn) {
      innFilter = `AND s_o.inn = $${params.length + 1}`
      params.push(inn)
    }
    result = await pool.query(
      `
          WITH data AS (SELECT 
                s_o.id, 
                s_o.name, 
                s_o.bank_klient, 
                s_o.raschet_schet, 
                s_o.raschet_schet_gazna, 
                s_o.mfo, 
                s_o.inn, 
                s_o.okonx 
              FROM spravochnik_organization AS s_o  
              JOIN users AS u ON s_o.user_id = u.id
              JOIN regions AS r ON u.region_id = r.id 
              WHERE s_o.isdeleted = false AND r.id = $1 ${innFilter}
              OFFSET $2
              LIMIT $3)
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (SELECT COUNT(s_o.id)
              FROM spravochnik_organization AS s_o  
              JOIN users AS u ON s_o.user_id = u.id
              JOIN regions AS r ON u.region_id = r.id 
              WHERE s_o.isdeleted = false AND r.id = $1 ${innFilter})::INTEGER AS total_count
          FROM data
      `,params);
    return { result: result.rows[0]?.data || [], total: result.rows[0]?.total_count || 0 };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdOrganizationService = async (region_id, id, ignoreDeleted = false) => {
  try {
    let query = `
      SELECT 
          s_o.id, 
          s_o.name, 
          s_o.bank_klient, 
          s_o.raschet_schet, 
          s_o.raschet_schet_gazna, 
          s_o.mfo, 
          s_o.inn, 
          s_o.okonx  
      FROM spravochnik_organization AS s_o 
      JOIN users ON s_o.user_id = users.id
      JOIN regions ON users.region_id = regions.id 
      WHERE regions.id = $1 
        AND s_o.id = $2
    `;
    if (!ignoreDeleted) {
      query += ` AND s_o.isdeleted = false`;
    }
    const result = await pool.query(query, [region_id, id]);
    if (!result.rows[0]) {
      throw new ErrorResponse(`Spravochnik organization not found`, 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

const updateOrganizationService = async (data) => {
  try {
    const result = await pool.query(
      `UPDATE spravochnik_organization SET name = $1, bank_klient = $2, raschet_schet = $3, raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $7
        WHERE id = $8 AND isdeleted = false RETURNING *
      `, [
      data.name,
      data.bank_klient,
      data.raschet_schet,
      data.raschet_schet_gazna,
      data.mfo,
      data.inn,
      data.okonx,
      data.id,
    ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

const deleteOrganizationService = async (id) => {
  try {
    await pool.query(
      `UPDATE spravochnik_organization SET isdeleted = $1 WHERE id = $2`,
      [true, id],
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

module.exports = {
  getByInnOrganizationService,
  createOrganizationService,
  getAllOrganizationService,
  getByIdOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
};
