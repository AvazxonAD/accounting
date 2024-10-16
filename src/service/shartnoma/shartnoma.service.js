const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const createShartnoma = async (data) => {
  try {
    const shartnoma = await pool.query(
      `INSERT INTO shartnomalar_organization(
          doc_num, 
          doc_date, 
          summa, 
          opisanie, 
          smeta_id, 
          user_id, 
          smeta2_id, 
          spravochnik_organization_id, 
          pudratchi_bool, 
          main_schet_id
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
        `,
      [
        data.doc_num,
        data.doc_date,
        data.summa,
        data.opisanie,
        data.smeta_id,
        data.user_id,
        data.smeta2_id,
        data.spravochnik_organization_id,
        data.pudratchi_bool,
        data.main_schet_id,
      ],
    );
    return shartnoma.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCodes)
  }
}

const getAllShartnoma = async (region_id, main_schet_id, offset, limit, filterValue) => {
  try {
    let filter = ``
    const params = [region_id, main_schet_id, offset, limit]
    if (typeof filterValue === "number") {
       filter = `AND sh_o.spravochnik_organization_id = $5`
      params.push(filterValue)
    }
    if (filterValue === 'true') {
      filter = `AND sh_o.pudratchi_bool = true`
    }
    if (filterValue === 'false') {
      filter = `AND sh_o.pudratchi_bool = false`
    }
    const { rows } = await pool.query(
      `WITH data AS (
          SELECT 
              sh_o.id,
              sh_o.spravochnik_organization_id,
              sh_o.doc_num,
              TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
              sh_o.smeta_id,
              sh_o.smeta2_id,
              sh_o.opisanie,
              sh_o.summa,
              sh_o.pudratchi_bool,
              smeta.smeta_number
          FROM shartnomalar_organization AS sh_o
          JOIN users AS u ON sh_o.user_id = u.id
          JOIN regions AS r ON u.region_id = r.id
          JOIN smeta ON sh_o.smeta_id = smeta.id
          WHERE sh_o.isdeleted = false ${filter}
              AND r.id = $1
              AND sh_o.main_schet_id = $2
          ORDER BY sh_o.doc_date 
          OFFSET $3 
          LIMIT $4
        ) 
        SELECT 
          ARRAY_AGG(row_to_json(data)) AS data,
          (SELECT COUNT(sh_o.id) 
           FROM shartnomalar_organization AS sh_o
           JOIN users AS u  ON sh_o.user_id = u.id
           JOIN regions AS r ON u.region_id = r.id
           WHERE sh_o.isdeleted = false ${filter}
             AND r.id = $1
             AND sh_o.main_schet_id = $2)::INTEGER AS total_count
        FROM data`, params);
    return { data: rows[0]?.data, total: rows[0]?.total_count }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdShartnomaService = async (region_id, main_schet_id, id, organization_id, ignoreDeleted = false,) => {
  try {
    const params = [region_id, main_schet_id, id]
    let organization = ``;
    let ignore = ``;

    if (!ignoreDeleted) {
      ignore = `AND sh_o.isdeleted = false`;
    }
    if (organization_id) {
      organization = `AND sh_o.spravochnik_organization_id = $4`
      params.push(organization_id)
    }
    const result = await pool.query(`
        SELECT 
              sh_o.spravochnik_organization_id,
              sh_o.doc_num,
              TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
              sh_o.smeta2_id,
              sh_o.smeta_id,
              sh_o.opisanie,
              sh_o.summa,
              sh_o.pudratchi_bool
        FROM shartnomalar_organization AS sh_o
        JOIN users  ON sh_o.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE regions.id = $1
          AND sh_o.main_schet_id = $2
          AND sh_o.id = $3 ${ignore} ${organization}
      `, params);
    if (!result.rows[0]) {
      throw new ErrorResponse(`Shartnoma not found`, 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateShartnomaDB = async (data) => {
  try {
    const conract = await pool.query(
      `UPDATE shartnomalar_organization 
        SET 
          doc_num = $1, 
          doc_date = $2, 
          summa = $3, 
          opisanie = $4, 
          smeta_id = $5, 
          smeta2_id = $6, 
          spravochnik_organization_id = $7, 
          pudratchi_bool = $8
        WHERE id = $9 RETURNING * 
      `,
      [
        data.doc_num,
        data.doc_date,
        data.summa,
        data.opisanie,
        data.smeta_id,
        data.smeta_2,
        data.spravochnik_organization_id,
        data.pudratchi_bool,
        data.id,
      ],
    );
    const grafik = await pool.query(
      `UPDATE shartnoma_grafik SET year = $1 WHERE id_shartnomalar_organization = $2 RETURNING *`,
      [data.doc_date.split('-')[0], data.id],
    );
    const result = conract.rows[0]
    result.grafik = grafik.rows[0]
    return result;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCodes)
  }
}

const deleteShartnomaDB = async (id) => {
  try {
    await pool.query(`UPDATE shartnoma_grafik SET isdeleted = $1 WHERE id_shartnomalar_organization = $2 AND isdeleted = false`, [true, id]);
    await pool.query(`UPDATE shartnomalar_organization SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


module.exports = {
  createShartnoma,
  getAllShartnoma,
  getByIdShartnomaService,
  updateShartnomaDB,
  deleteShartnomaDB,
};
