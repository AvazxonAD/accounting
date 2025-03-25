const { db } = require("@db/index");
const { sqlFilter } = require("@helper/functions");

exports.PodpisDB = class {
  static async get(params, type) {
    let index_type;

    if (type) {
      index_type = params.length + 1;
      params.push(type);
    }

    const query = `--sql
        SELECT 
            d.id,
            d.type_document,
            d.numeric_poryadok,
            d.doljnost_name AS              position,
            d.fio_name AS                   fio
        FROM spravochnik_podpis_dlya_doc AS d
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE r.id = $1
            AND d.isdeleted = false
            ${type ? sqlFilter("d.type_document", index_type) : ""}
        ORDER BY d.numeric_poryadok
    `;

    const result = await db.query(query, params);

    return result;
  }
};
