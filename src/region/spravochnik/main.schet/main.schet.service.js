const pool = require("@config/db");
const ErrorResponse = require("@utils/errorResponse");

const getByIdMainSchetService = async (region_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``
    if (!ignoreDeleted) {
      ignore = ` AND msch.isdeleted = false`;
    }
    const result = await pool.query(`
      SELECT 
        msch.*,
        s_b_n.name AS budjet_name
      FROM main_schet msch
      JOIN users AS u ON msch.user_id = u.id
      JOIN regions AS r ON u.region_id = r.id
      JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = msch.spravochnik_budjet_name_id
      WHERE r.id = $1 ${ignore}
        AND msch.id = $2`,
      [region_id, id]);
    if (!result.rows[0]) {
      throw new ErrorResponse(`Main schet not found`, 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const createMainSchetService = async (data) => {
  try {
    const result = await pool.query(
      `   INSERT INTO main_schet(
          account_number,
          spravochnik_budjet_name_id,
          tashkilot_nomi,
          tashkilot_bank,
          tashkilot_mfo,
          tashkilot_inn,
          account_name,
          jur1_schet,
          jur1_subschet,
          jur2_schet,
          jur2_subschet,
          jur3_schet,
          jur3_subschet,
          jur4_subschet,
          jur4_schet,
          gazna_number,
          user_id
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *
      `, [
      data.account_number,
      data.spravochnik_budjet_name_id,
      data.tashkilot_nomi,
      data.tashkilot_bank,
      data.tashkilot_mfo,
      data.tashkilot_inn,
      data.account_name,
      data.jur1_schet,
      data.jur1_subschet,
      data.jur2_schet,
      data.jur2_subschet,
      data.jur3_schet,
      data.jur3_subschet,
      data.jur4_subschet,
      data.jur4_schet,
      data.gazna_number,
      data.user_id,
    ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllMainSchetService = async (region_id, offset, limit, search) => {
  try {
    const params = [region_id, offset, limit]
    let search_filter = ``
    if (search) {
      search_filter = `AND (
        main_schet.tashkilot_nomi ILIKE '%' || $${params.length + 1} || '%' OR
        main_schet.tashkilot_inn ILIKE '%' || $${params.length + 1} || '%' OR
        main_schet.account_name ILIKE '%' || $${params.length + 1} || '%' OR
        main_schet.account_number ILIKE '%' || $${params.length + 1} || '%' 
        )`
      params.push(search)
    }
    const result = await pool.query(
      `
          WITH data AS (SELECT 
              main_schet.*, 
              spravochnik_budjet_name.name AS budjet_name,
              spravochnik_budjet_name.id AS spravochnik_budjet_name_id 
            FROM main_schet
            JOIN users ON main_schet.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_budjet_name 
                ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
            WHERE main_schet.isdeleted = false AND regions.id = $1 ${search_filter} OFFSET $2 LIMIT $3)
          SELECT 
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (SELECT COUNT(main_schet.id)
              FROM main_schet
              JOIN users ON main_schet.user_id = users.id
              JOIN regions ON users.region_id = regions.id
              WHERE main_schet.isdeleted = false ${search_filter}
              AND regions.id = $1)::INTEGER AS total_count
          FROM data 
      `, params);
    return { result: result.rows[0]?.data || [], total: result.rows[0]?.total_count || 0 };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateMainSchetService = async (data) => {
  try {
    const result = await pool.query(`UPDATE  main_schet SET 
          account_number = $1, 
          spravochnik_budjet_name_id = $2, 
          tashkilot_nomi = $3, 
          tashkilot_bank = $4, 
          tashkilot_mfo = $5, 
          tashkilot_inn = $6, 
          account_name = $7, 
          jur1_schet = $8, 
          jur1_subschet = $9, 
          jur2_schet = $10, 
          jur2_subschet = $11, 
          jur3_schet = $12, 
          jur3_subschet = $13, 
          jur4_subschet = $14, 
          jur4_schet = $15,
          gazna_number = $16
          WHERE id = $17 RETURNING * 
      `, [
      data.account_number,
      data.spravochnik_budjet_name_id,
      data.tashkilot_nomi,
      data.tashkilot_bank,
      data.tashkilot_mfo,
      data.tashkilot_inn,
      data.account_name,
      data.jur1_schet,
      data.jur1_subschet,
      data.jur2_schet,
      data.jur2_subschet,
      data.jur3_schet,
      data.jur3_subschet,
      data.jur4_subschet,
      data.jur4_schet,
      data.gazna_number,
      data.id,
    ])
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteMainSchetService = async (id) => {
  try {
    await pool.query(`UPDATE main_schet SET isdeleted = $1 WHERE id = $2`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByBudjetIdMainSchetService = async (budjet_id, region_id) => {
  try {
    const result = await pool.query(
      `
        SELECT 
          main_schet.id AS main_schet_id, 
          main_schet.account_number 
        FROM main_schet 
        JOIN users ON main_schet.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE main_schet.spravochnik_budjet_name_id = $1 
          AND main_schet.isdeleted = false
          AND regions.id = $2
      `, [budjet_id, region_id]);
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const checkMainSchetService = async (id) => {
  try {
    const tables = await pool.query(`SELECT conrelid::regclass AS name FROM  pg_constraint WHERE confrelid = 'main_schet'::regclass`)
    for (let table of tables.rows) {
      const test = await pool.query(`SELECT * FROM ${table.name} WHERE main_schet_id = $1 AND isdeleted = false`, [id])
      if (test.rows.length > 0) {
        throw new ErrorResponse('Cannot delete this data as it is linked to existing documents', 400)
      }
    }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByAccountNumberMainSchetService = async (region_id, account_number) => {
  try {
    const result = await pool.query(`SELECT main_schet.* 
      FROM main_schet 
      JOIN users ON users.id = main_schet.user_id
      JOIN regions ON regions.id = users.region_id
      WHERE main_schet.account_number = $1 AND main_schet.isdeleted = false AND regions.id = $2`, [account_number, region_id])
    if (result.rows[0]) {
      throw new ErrorResponse('This data has already been entered', 409)
    }
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByIdMainSchetService,
  createMainSchetService,
  getAllMainSchetService,
  updateMainSchetService,
  deleteMainSchetService,
  getByBudjetIdMainSchetService,
  checkMainSchetService,
  getByAccountNumberMainSchetService
}
