const { db } = require('@db/index');

exports.SmetaGrafikDB = class {
  static async createSmetaGrafik(params) {
    const query = `--sql
            INSERT INTO smeta_grafik (
                smeta_id, spravochnik_budjet_name_id, user_id, 
                itogo, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, 
                oy_7, oy_8, oy_9, oy_10, oy_11, oy_12, year
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                $11, $12, $13, $14, $15, $16, $17
            ) RETURNING *;
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async getSmetaGrafik(params, budjet_id, operator, year, search) {
    let budjet_filter = ``;
    let operator_filter = ``;
    let year_filter = ``;
    let search_filter = ``;
    if (search) {
      params.push(search)
      search_filter = `AND (smeta.smeta_name ILIKE '%' || $${params.length} || '%' OR smeta.smeta_number ILIKE '%' || $${params.length} || '%')`
    }
    if (budjet_id) {
      budjet_filter = `AND s_g.spravochnik_budjet_name_id = $${params.length + 1}`
      params.push(budjet_id)
    }
    if (operator) {
      operator_filter = `AND s_g.itogo ${operator} 0`;
    }
    if (year) {
      params.push(year);
      year_filter = `AND s_g.year = $${params.length}`;
    }
    const query = `--sql
          WITH data AS 
            (SELECT 
                s_g.id, 
                s_g.smeta_id, 
                smeta.smeta_name,
                smeta.smeta_number,
                s_g.spravochnik_budjet_name_id,
                spravochnik_budjet_name.name AS budjet_name,
                s_g.itogo::FLOAT,
                s_g.oy_1::FLOAT,
                s_g.oy_2::FLOAT,
                s_g.oy_3::FLOAT,
                s_g.oy_4::FLOAT,
                s_g.oy_5::FLOAT,
                s_g.oy_6::FLOAT,
                s_g.oy_7::FLOAT,
                s_g.oy_8::FLOAT,
                s_g.oy_9::FLOAT,
                s_g.oy_10::FLOAT,
                s_g.oy_11::FLOAT,
                s_g.oy_12::FLOAT,
                s_g.year
              FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id  
              JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = s_g.spravochnik_budjet_name_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1  
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
              OFFSET $2 LIMIT $3 
            )
          SELECT
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (SELECT COALESCE(COUNT(s_g.id), 0) FROM smeta_grafik AS s_g 
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::INTEGER total_count,
            (SELECT COALESCE(SUM(s_g.itogo), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT itogo,
            (SELECT COALESCE(SUM(s_g.oy_1), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_1,
            (SELECT COALESCE(SUM(s_g.oy_2), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_2,
            (SELECT COALESCE(SUM(s_g.oy_3), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_3,
            (SELECT COALESCE(SUM(s_g.oy_4), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_4,
            (SELECT COALESCE(SUM(s_g.oy_5), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_5,
            (SELECT COALESCE(SUM(s_g.oy_6), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_6,
            (SELECT COALESCE(SUM(s_g.oy_7), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_7,
            (SELECT COALESCE(SUM(s_g.oy_8), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_8,
            (SELECT COALESCE(SUM(s_g.oy_9), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_9,
            (SELECT COALESCE(SUM(s_g.oy_10), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_10,
            (SELECT COALESCE(SUM(s_g.oy_11), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_11,
            (SELECT COALESCE(SUM(s_g.oy_12), 0) FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s_g.smeta_id
              WHERE s_g.isdeleted = false 
                AND regions.id = $1 
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_12
          FROM data
        `;
    const result = await db.query(query, params);

    return {
      data: result[0]?.data || [],
      total: result[0]?.total_count,
      itogo: result[0].itogo,
      oy_1: result[0].oy_1,
      oy_2: result[0].oy_2,
      oy_3: result[0].oy_3,
      oy_4: result[0].oy_4,
      oy_5: result[0].oy_5,
      oy_6: result[0].oy_6,
      oy_7: result[0].oy_7,
      oy_8: result[0].oy_8,
      oy_9: result[0].oy_9,
      oy_10: result[0].oy_10,
      oy_11: result[0].oy_11,
      oy_12: result[0].oy_12,
    }
  }

  static async getByIdSmetaGrafik(params, isdeleted) {
    const ignore = 'AND s_g.isdeleted = false'
    const query = `--sql
            SELECT
                s_g.id, 
                s_g.smeta_id, 
                smeta.smeta_name,
                smeta.smeta_number,
                s_g.spravochnik_budjet_name_id,
                spravochnik_budjet_name.name AS budjet_name,
                s_g.itogo::FLOAT,
                s_g.oy_1::FLOAT,
                s_g.oy_2::FLOAT,
                s_g.oy_3::FLOAT,
                s_g.oy_4::FLOAT,
                s_g.oy_5::FLOAT,
                s_g.oy_6::FLOAT,
                s_g.oy_7::FLOAT,
                s_g.oy_8::FLOAT,
                s_g.oy_9::FLOAT,
                s_g.oy_10::FLOAT,
                s_g.oy_11::FLOAT,
                s_g.oy_12::FLOAT,
                s_g.year,
                s_g.isdeleted
            FROM smeta_grafik AS s_g
            JOIN users ON s_g.user_id = users.id
            JOIN regions ON users.region_id = regions.id  
            JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = s_g.spravochnik_budjet_name_id
            JOIN smeta ON smeta.id = s_g.smeta_id
            WHERE regions.id = $1 AND s_g.id = $2 ${isdeleted ? '' : ignore}
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async updateSmetaGrafik(params) {
    const query = `--sql
            UPDATE smeta_grafik SET 
                itogo = $1, oy_1 = $2, oy_2 = $3, oy_3 = $4,
                oy_4 = $5, oy_5 = $6, oy_6 = $7, oy_7 = $8,
                oy_8 = $9, oy_9 = $10, oy_10 = $11, oy_11 = $12, oy_12 = $13, 
                smeta_id = $14, spravochnik_budjet_name_id = $15, year = $16
            WHERE id = $17 AND isdeleted = false RETURNING *
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async deleteSmetaGrafik(params) {
    const query = `UPDATE smeta_grafik SET isdeleted = true WHERE id = $1 RETURNING id`;

    const result = await db.query(query, params);

    return result;
  }

  static async getByAllSmetaGrafik(params) {
    const query = `--sql   
            SELECT s_g.* 
            FROM smeta_grafik AS s_g
            JOIN users ON s_g.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 AND s_g.smeta_id = $2 AND s_g.isdeleted = false AND s_g.spravochnik_budjet_name_id = $3 AND s_g.year = $4
        `;
    const result = await db.query(query, params);
    return result[0]
  }
};
