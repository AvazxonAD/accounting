const { db } = require("@db/index");

exports.WorkerTripDB = class {
  static async get(params, search = null, order_by, order_type) {
    let search_filter = ``;
    let order = ``;
    if (search) {
      params.push(search);
      search_filter = ` AND (
                d.doc_num = $${params.length} OR 
                sp.name ILIKE '%' || $${params.length} || '%'
            )`;
    }

    if (order_by === "doc_num") {
      order = `ORDER BY 
        CASE WHEN d.doc_num ~ '^[0-9]+$' THEN d.doc_num::BIGINT ELSE NULL END ${order_type} NULLS LAST, 
        d.doc_num ${order_type}`;
    } else {
      order = `ORDER BY d.${order_by} ${order_type}`;
    }

    const query = `--sql
            WITH data AS (
                SELECT 
                    d.*, 
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                    d.summa::FLOAT, 
                    sp.name AS worker_name,
                    sp.rayon AS worker_rayon,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM work_trip_child AS ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.schet_id
                            WHERE  ch.parent_id = d.id 
                        ) AS ch
                    ) AS provodki_array
                FROM work_trip AS d
                JOIN users AS u ON u.id =  d.user_id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.worker_id 
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $3 AND $4
                    AND d.schet_id = $5
                    ${search_filter}
                ${order}
                OFFSET $6 LIMIT $7
            ) 
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT 
                      COALESCE(COUNT(d.id), 0)
                    FROM work_trip AS d
                    JOIN users AS u ON u.id =  d.user_id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.worker_id 
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND d.schet_id = $5
                        ${search_filter}
                )::INTEGER AS total_count,
                (
                    SELECT 
                      COALESCE(SUM(d.summa), 0)
                    FROM work_trip AS d
                    JOIN users AS u ON u.id =  d.user_id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.worker_id 
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND d.schet_id = $5
                        ${search_filter}
                )::FLOAT AS summa
            FROM data
        `;

    const result = await db.query(query, params);

    return {
      data: result[0].data || [],
      summa: result[0].summa,
      total_count: result[0].total_count,
    };
  }

  static async create(params, client) {
    const query = `--sql
      INSERT INTO work_trip (
        user_id, doc_num, doc_date, from_date, to_date, day_summa,
        hostel_ticket_number, hostel_summa, from_district_id, to_district_id,
        road_ticket_number, road_summa, summa, comment,
        main_schet_id, schet_id, worker_id, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17, $18, $19
      )
      RETURNING id
    `;

    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async createChild(params, _values, client) {
    const query = `--sql
      INSERT INTO work_trip_child (
          schet_id,
          summa,
          type,
          parent_id,
          created_at,
          updated_at
      )
      VALUES ${_values}
    `;

    await client.query(query, params);
  }

  static async getById(params, isdeleted) {
    const query = `--sql
            SELECT 
                d.*, 
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                TO_CHAR(d.from_date, 'YYYY-MM-DD') AS from_date, 
                TO_CHAR(d.to_date, 'YYYY-MM-DD') AS to_date,
                fd.name AS from_district_name,
                td.name AS to_district_name,
                d.summa::FLOAT, 
                sp.name AS worker_name,
                sp.rayon AS worker_rayon,
                row_to_json(sp) AS worker,
                (
                    SELECT JSON_AGG(row_to_json(child))
                    FROM (
                        SELECT   
                            ch.*,
                            so.name AS schet_name,
                            ch.summa::FLOAT,
                            row_to_json(so) AS schet
                        FROM  work_trip_child AS ch 
                        JOIN spravochnik_operatsii AS so ON so.id = ch.schet_id
                        WHERE ch.parent_id = $4
                          AND ch.isdeleted = false 
                    ) AS child
                ) AS childs
            FROM work_trip AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.worker_id
            JOIN districts fd ON fd.id = d.from_district_id
            JOIN districts td ON td.id = d.to_district_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.schet_id = $3
                AND d.id = $4
                ${!isdeleted ? "AND d.isdeleted = false" : ""}   
        `;
    const data = await db.query(query, params);
    return data[0];
  }

  static async update(params, client) {
    const query = `--sql
      UPDATE work_trip SET 
        doc_num = $1,
        doc_date = $2,
        from_date = $3,
        to_date = $4,
        day_summa = $5,
        hostel_ticket_number = $6,
        hostel_summa = $7,
        from_district_id = $8,
        to_district_id = $9,
        road_ticket_number = $10,
        road_summa = $11,
        summa = $12,
        comment = $13,
        worker_id = $14,
        updated_at = $15
      WHERE id = $16
      RETURNING id
    `;

    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async deleteChild(params, client) {
    const query = `DELETE FROM work_trip_child WHERE parent_id = $1`;
    await client.query(query, params);
  }

  static async delete(params, client) {
    await client.query(`UPDATE work_trip_child SET isdeleted = true WHERE parent_id = $1`, params);
    const result = await client.query(`UPDATE work_trip SET  isdeleted = true WHERE id = $1 RETURNING id`, params);

    return result.rows[0];
  }
};
