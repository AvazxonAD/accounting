const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const ErrorResponse = require("../../utils/errorResponse");

const createShartnoma = handleServiceError(async (data) => {
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
      data.doc_num,
      data.doc_date,
      data.summa,
      data.opisanie,
      data.smeta_id,
      data.user_id,
      data.smeta_2,
      data.spravochnik_organization_id,
      data.pudratchi_bool,
      data.main_schet_id,
    ],
  );
  return shartnoma.rows[0];
});

const getAllShartnoma = async (region_id, main_schet_id, offset, limit, organization_id, pudratchi_bool) => {
  let organization = ``
  let pudratchi = ''
  const params = [region_id, main_schet_id, offset, limit]
  if (organization_id) {
    organization = `AND sh_o.spravochnik_organization_id = $5`
    params.push(organization_id)
  }
  if (pudratchi_bool === 'true') {
    pudratchi = `AND sh_o.pudratchi_bool = true`
  }
  if (pudratchi_bool === 'false') {
    pudratchi = `AND sh_o.pudratchi_bool = false`
  }
  const result = await pool.query(
    `WITH data AS (
        SELECT 
            sh_o.id,
            sh_o.spravochnik_organization_id,
            sh_o.doc_num,
            TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
            sh_o.smeta_id,
            sh_o.opisanie,
            sh_o.summa,
            sh_o.pudratchi_bool 
        FROM shartnomalar_organization AS sh_o
        JOIN users AS u ON sh_o.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE sh_o.isdeleted = false ${organization} ${pudratchi}
            AND r.id = $1
            AND sh_o.main_schet_id = $2
        ORDER BY sh_o.doc_date DESC 
        OFFSET $3 
        LIMIT $4
      ) 
      SELECT 
        ARRAY_AGG(row_to_json(data)) AS data,
        (SELECT COUNT(sh_o.id) 
         FROM shartnomalar_organization AS sh_o
         JOIN users AS u  ON sh_o.user_id = u.id
         JOIN regions AS r ON u.region_id = r.id
         WHERE sh_o.isdeleted = false ${organization} ${pudratchi}
           AND r.id = $1
           AND sh_o.main_schet_id = $2)::INTEGER AS total_count
      FROM data`, params);
  return result.rows[0];
}

const getByIdShartnomaService = async (region_id, main_schet_id, id, ignoreDeleted = false, organization_id) => {
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

const updateShartnomaDB = handleServiceError(async (data) => {
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
  await pool.query(
    `UPDATE shartnoma_grafik SET year = $1 WHERE id_shartnomalar_organization = $2`,
    [data.grafik_year, data.id],
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
  async (region_id, main_schet_id, organization_id, pudratchi) => {
    let query = `
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
    `
    if (pudratchi) {
      query += `   AND pudratchi_bool = true`
    }
    const result = await pool.query(query, [region_id, main_schet_id, organization_id],);
    return result.rows;
  },
);

const getByIdAndOrganizationIdShartnoma = async (region_id, main_schet_id, id, organization_id) => {
  try {
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
    if (!result.rows[0]) {
      throw new ErrorResponse('conrtact not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

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
  getByIdShartnomaService,
  updateShartnomaDB,
  getByIdOrganizationShartnoma,
  deleteShartnomaDB,
  getByIdAndOrganizationIdShartnoma,
  forJur3DB
};
