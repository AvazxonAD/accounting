const ErrorResponse = require("@helper/error.response");
const { db, pool } = require("@db/index");

const createOperatsiiService = async (data) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_operatsii(
          name,  schet, sub_schet, type_schet, smeta_id, budjet_id
          ) VALUES($1, $2, $3, $4, $5, $6) RETURNING * 
      `,
      [
        data.name,
        data.schet,
        data.sub_schet,
        data.type_schet,
        data.smeta_id,
        data.budjet_id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getByNameAndSchetOperatsiiService = async (
  name,
  type_schet,
  smeta_id
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false AND smeta_id = $3`,
      [name, type_schet, smeta_id]
    );
    if (result.rows[0]) {
      throw new ErrorResponse("This data has already been entered", 409);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getAllOperatsiiService = async (
  offset,
  limit,
  type_schet,
  search,
  meta_search,
  schet,
  sub_schet,
  budjet_id
) => {
  try {
    let schet_filter = ``;
    let sub_schet_filter = "";
    let type_schet_filter = "";
    let search_filter = ``;
    let meta_search_filter = ``;
    let budjet_filter = ``;

    const params = [offset, limit];

    if (search) {
      params.push(search);
      search_filter = `AND ( s.schet ILIKE '%' || $${params.length} || '%' OR s.name ILIKE '%' || $${params.length} || '%' OR s.sub_schet ILIKE '%' || $${params.length} || '%')`;
    }

    if (type_schet) {
      type_schet_filter = `AND s.type_schet = $${params.length + 1}`;
      params.push(type_schet);
    }

    if (meta_search) {
      params.push(meta_search);
      meta_search_filter = `AND s.sub_schet ILIKE '%' || $${params.length} || '%'`;
    }

    if (schet) {
      params.push(schet);
      schet_filter = `AND s.schet = $${params.length}`;
    }

    if (sub_schet) {
      params.push(sub_schet);
      sub_schet_filter = `AND s.sub_schet ILIKE '%' || $${params.length} || '%'`;
    }

    if (budjet_id) {
      params.push(budjet_id);
      budjet_filter = `AND s.budjet_id = $${params.length}`;
    }

    const query = `--sql
      WITH data AS (
        SELECT 
          s.id, 
          s.name, 
          s.schet, 
          s.sub_schet, 
          s.type_schet, 
          s.smeta_id, 
          b.id AS budjet_id, 
          b.name AS budjet_name
        FROM spravochnik_operatsii s 
        LEFT JOIN spravochnik_budjet_name b ON b.id = s.budjet_id
        WHERE s.isdeleted = false 
          AND (
            s.type_schet = 'akt' OR 
            s.type_schet = 'bank_prixod' OR 
            s.type_schet = 'avans_otchet' OR 
            s.type_schet = 'kassa_prixod' OR 
            s.type_schet = 'kassa_rasxod' OR 
            s.type_schet = 'jur3' OR 
            s.type_schet = 'jur4' OR 
            s.type_schet = 'bank_rasxod' OR 
            s.type_schet = 'jur7' OR 
            s.type_schet = 'show_service'
          )
          ${schet_filter}
          ${sub_schet_filter}
          ${search_filter} 
          ${type_schet_filter}
          ${meta_search_filter} 
          ${budjet_filter}
        OFFSET $1 LIMIT $2
      )
      SELECT 
        COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
        (
          SELECT 
            COALESCE(COUNT(s.id), 0)::INTEGER
          FROM spravochnik_operatsii s
          WHERE s.isdeleted = false
            AND (
              s.type_schet = 'akt' OR 
              s.type_schet = 'bank_prixod' OR 
              s.type_schet = 'avans_otchet' OR 
              s.type_schet = 'kassa_prixod' OR 
              s.type_schet = 'kassa_rasxod' OR 
              s.type_schet = 'bank_rasxod' OR 
              s.type_schet = 'general' OR 
              s.type_schet = 'show_service'
            )
            ${schet_filter}
            ${sub_schet_filter}
            ${search_filter} 
            ${type_schet_filter}
            ${meta_search_filter}
            ${budjet_filter}
        )::INTEGER AS total_count
      FROM data
    `;

    const result = await db.query(query, params);

    return {
      result: result[0]?.data || [],
      total: result[0]?.total_count || 0,
    };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getOperatsiiByChildArray = async (childs, type) => {
  try {
    const ids = childs.map((item) => item.spravochnik_operatsii_id);
    const placeHolders = ids.map((_, i) => `$${i + 2}`).join(", ");
    const values = [type, ...ids];
    const operatsii = await pool.query(
      `SELECT schet
      FROM spravochnik_operatsii 
      WHERE type_schet = $1 AND isdeleted = false AND id IN (${placeHolders})
    `,
      values
    );
    return operatsii.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode || 500);
  }
};

const getByIdOperatsiiService = async (
  id,
  type_schet = null,
  ignoreDeleted = false
) => {
  try {
    const params = [id];
    let ignore = ``;
    let type_schet_filter = ``;
    if (!ignoreDeleted) {
      ignore = `AND s.isdeleted = false`;
    }
    if (type_schet) {
      type_schet_filter = ` AND s.type_schet = $${params.length + 1}`;
      params.push(type_schet);
    }
    const result = await pool.query(
      `
      SELECT 
        s.id, 
        s.name, 
        s.schet, 
        s.sub_schet, 
        s.type_schet, 
        s.smeta_id, 
        b.id AS budjet_id, 
        b.name AS budjet_name
      FROM spravochnik_operatsii s 
      LEFT JOIN spravochnik_budjet_name b ON b.id = s.budjet_id
      WHERE s.isdeleted = false
        AND s.id = $1 
        ${type_schet_filter} 
        ${ignore}
      `,
      params
    );

    if (!result.rows[0]) {
      throw new ErrorResponse(`Spravochnik operatsii not found`, 404);
    }

    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const updateOperatsiiService = async (data) => {
  const result = await pool.query(
    `UPDATE spravochnik_operatsii 
      SET name = $1, schet = $2, sub_schet = $3, type_schet = $4, smeta_id = $5, budjet_id = $6
      WHERE id = $7 RETURNING * 
    `,
    [
      data.name,
      data.schet,
      data.sub_schet,
      data.type_schet,
      data.smeta_id,
      data.budjet_id,
      data.id,
    ]
  );
  return result.rows[0];
};

const deleteOperatsiiService = async (id) => {
  await pool.query(
    `UPDATE spravochnik_operatsii SET isdeleted = $1 WHERE id = $2`,
    [true, id]
  );
};

const getBySchetService = async (schet) => {
  try {
    const result = await pool.query(
      `
          SELECT id, name, schet, sub_schet, type_schet, smeta_id, budjet_id
          FROM spravochnik_operatsii 
          WHERE schet = $1  AND isdeleted = false
        `,
      [schet]
    );
    if (!result.rows[0]) {
      throw new ErrorResponse("Schet not found", 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getSchetService = async () => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT schet FROM spravochnik_operatsii WHERE  isdeleted = false`
    );
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

module.exports = {
  getByNameAndSchetOperatsiiService,
  createOperatsiiService,
  getAllOperatsiiService,
  getByIdOperatsiiService,
  updateOperatsiiService,
  deleteOperatsiiService,
  getBySchetService,
  getSchetService,
  getOperatsiiByChildArray,
};
