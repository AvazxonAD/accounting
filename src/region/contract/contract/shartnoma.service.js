const pool = require("@config/db");
const ErrorResponse = require("@utils/errorResponse");

const createShartnoma = async (data) => {
  try {
    const shartnoma = await pool.query(
      `
        INSERT INTO shartnomalar_organization(
          doc_num, 
          doc_date, 
          summa, 
          opisanie, 
          user_id, 
          spravochnik_organization_id, 
          pudratchi_bool, 
          budjet_id,
          yillik_oylik,
          smeta_id
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
      [
        data.doc_num,
        data.doc_date,
        data.summa,
        data.opisanie,
        data.user_id,
        data.spravochnik_organization_id,
        data.pudratchi_bool,
        data.budjet_id,
        data.yillik_oylik,
        data.smeta_id
      ]
    );
    
    return shartnoma.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCodes)
  }
}

const getAllShartnoma = async (region_id, budjet_id, offset, limit, organization, pudratchi, search) => {
  try {
    let search_filter = ``
    let filter_organization = ``
    let pudratchi_filter = ``
    const params = [region_id, budjet_id, offset, limit]
    if (organization) {
      filter_organization = `AND sho.spravochnik_organization_id = $5`
      params.push(organization)
    }
    if (pudratchi === 'true') {
      pudratchi_filter = `AND sho.pudratchi_bool = true`
    }
    if (pudratchi === 'false') {
      pudratchi_filter = `AND sho.pudratchi_bool = false`
    }
    if(search){
      search_filter = `AND (sho.doc_num ILIKE '%' || $${params.length + 1} || '%' OR sho.opisanie ILIKE '%' || $${params.length + 1} || '%')`
      params.push(search)
    }
    const { rows } = await pool.query(`--sql
      WITH data AS (
          SELECT 
              sho.id,
              sho.spravochnik_organization_id,
              sho.doc_num,
              TO_CHAR(sho.doc_date, 'YYYY-MM-DD') AS doc_date,
              sho.smeta_id,
              sho.smeta2_id,
              sho.opisanie,
              sho.summa,
              sho.pudratchi_bool,
              smeta.smeta_number,
              sho.budjet_id,
              sho.yillik_oylik
          FROM shartnomalar_organization AS sho
          JOIN users AS u ON sho.user_id = u.id
          JOIN regions AS r ON u.region_id = r.id
          LEFT JOIN smeta ON sho.smeta_id = smeta.id
          WHERE sho.isdeleted = false 
              ${filter_organization} 
              ${pudratchi_filter} 
              ${search_filter}
              AND r.id = $1
              AND sho.budjet_id = $2
          
          ORDER BY sho.doc_date 
          
          OFFSET $3 LIMIT $4
        ) 
        SELECT 
          COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
          (
              SELECT 
                COALESCE(COUNT(sho.id), 0)::INTEGER 
              FROM shartnomalar_organization AS sho
              JOIN users AS u  ON sho.user_id = u.id
              JOIN regions AS r ON u.region_id = r.id
              WHERE sho.isdeleted = false 
                ${filter_organization} 
                ${pudratchi_filter} 
                ${search_filter}
                AND r.id = $1
                AND sho.budjet_id = $2
          )::INTEGER AS total_count,
          (
            SELECT 
              COALESCE(COUNT(sho.summa), 0)::INTEGER 
            FROM shartnomalar_organization AS sho
            JOIN users AS u  ON sho.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            WHERE sho.isdeleted = false 
              ${filter_organization} 
              ${pudratchi_filter} 
              ${search_filter}
              AND r.id = $1
              AND sho.budjet_id = $2
          )::FLOAT AS summa
        
        FROM data

    `, params);

    return { data: rows[0]?.data || [], total: rows[0]?.total_count, summa: rows[0]?.summa }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdShartnomaServiceForJur7 = async (region_id, id, organization_id) => {
  try {
    const result = await pool.query(`--sql
        SELECT sho.id
        FROM shartnomalar_organization AS sho
        JOIN users  ON sho.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE regions.id = $1 AND sho.id = $2 AND sho.isdeleted = false AND sho.spravochnik_organization_id = $3
    `, [region_id, id, organization_id]);
    if(!result.rows[0]){
      throw new ErrorResponse('contract not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdShartnomaService = async (region_id, budjet_id, id, organization_id = null, ignoreDeleted = false,) => {
  try {
    const params = [region_id, budjet_id, id]
    let organization = ``;
    let ignore = ``;

    if (!ignoreDeleted) {
      ignore = `AND sho.isdeleted = false`;
    }
    if (organization_id) {
      organization = `AND sho.spravochnik_organization_id = $4`
      params.push(organization_id)
    }
    const query = `--sql
      SELECT
        sho.id, 
        sho.spravochnik_organization_id,
        sho.doc_num,
        TO_CHAR(sho.doc_date, 'YYYY-MM-DD') AS doc_date,
        sho.smeta2_id,
        sho.smeta_id,
        sho.opisanie,
        sho.summa::FLOAT,
        sho.pudratchi_bool,
        sho.yillik_oylik
      FROM shartnomalar_organization AS sho
      JOIN users  ON sho.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE regions.id = $1
        AND sho.budjet_id = $2
        AND sho.id = $3 ${ignore} ${organization}
    `;
    const result = await pool.query(query, params);
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
          pudratchi_bool = $8,
          yillik_oylik = $9
        WHERE id = $10 RETURNING * 
      `,
      [
        data.doc_num,
        data.doc_date,
        data.summa,
        data.opisanie,
        data.smeta_id,
        data.smeta2_id,
        data.spravochnik_organization_id,
        data.pudratchi_bool,
        data.yillik_oylik,
        data.id
      ],
    );
    const result = conract.rows[0]
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
  getByIdShartnomaServiceForJur7
};
