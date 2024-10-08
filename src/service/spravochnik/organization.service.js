const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const ErrorResponse = require("../../utils/errorResponse");

const getByInnOrganization = async (inn, region_id) => {
  try {
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
    if(!result.rows[0]){
      throw new ErrorResponse('organization not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

const createOrganization = async (data) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_organization(
          name, bank_klient, raschet_schet, 
          raschet_schet_gazna, mfo, inn, user_id, okonx
          ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING *
      `,
      [
        data.name,
        data.bank_klient,
        data.raschet_schet,
        data.raschet_schet_gazna,
        data.mfo,
        data.inn,
        data.user_id,
        data.okonx,
      ],
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

const getAllOrganization = async (region_id, offset, limit) => {
    try {
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
    } catch (error) {
      throw new ErrorResponse(error, error.statusCode)
    }

  }

const totalOrganization = async (region_id) => {
  try {
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
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

const getByIdOrganization = async (region_id, id, ignoreDeleted = false) => {
  try {
    let query = `
      SELECT 
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
      WHERE regions.id = $1 
        AND spravochnik_organization.id = $2
    `;
    let params = [region_id, id];

    if (!ignoreDeleted) {
      query += ` AND spravochnik_organization.isdeleted = false`;
    }

    const result = await pool.query(query, params);
    if (!result.rows[0]) {
      throw new ErrorResponse(`Spravochnik organization not found`, 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}


const updateOrganization = async (data) => {
  try {
    await pool.query(
      `UPDATE spravochnik_organization 
            SET name = $1, bank_klient = $2, raschet_schet = $3, raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $7
            WHERE id = $8 AND isdeleted = false
        `,
      [
        data.name,
        data.bank_klient,
        data.raschet_schet,
        data.raschet_schet_gazna,
        data.mfo,
        data.inn,
        data.okonx,
        data.id,
      ],
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

const deleteOrganization = async (id) => {
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
  getByInnOrganization,
  createOrganization,
  getAllOrganization,
  totalOrganization,
  getByIdOrganization,
  updateOrganization,
  deleteOrganization,
};
