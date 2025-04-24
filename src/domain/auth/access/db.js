const { returnParamsValues } = require("@helper/functions");
const { db } = require("@db/index");

exports.AccessDB = class {
  static async createAccess(params, client) {
    const values = returnParamsValues(params, 4);

    const query = `INSERT INTO access (role_id, region_id, created_at, updated_at) VALUES ${values}`;

    const result = await client.query(query, params);

    return result;
  }

  static async deleteAccess(params, client) {
    const query = `UPDATE access SET isdeleted = true WHERE role_id = $1`;
    await client.query(query, params);
  }

  static async getByRoleIdAccess(params, region_id) {
    let index_region_id;

    if (region_id) {
      params.push(region_id);
      index_region_id = params.length;
    }
    const query = `--sql
            SELECT
                a.id,
                a.kassa,
                a.bank,
                a.jur3,
                a.jur4,
                a.jur5,
                a.jur7,
                a.jur8,
                a.spravochnik,
                a.region,
                a.main_book,
                a.smeta_grafik,
                a.odinox,
                r.name AS role_name
            FROM access AS a
            JOIN role AS r ON r.id = a.role_id
            WHERE r.id = $1
                ${region_id ? `AND a.region_id = $${index_region_id}` : ""} 
        `;

    const data = await db.query(query, params);

    return data[0];
  }

  static async getByIdAccess(params, isdeleted = null) {
    const query = `SELECT * FROM access WHERE region_id = $1 AND access.id = $2 ${!isdeleted ? "AND isdeleted = false" : ""}`;
    const data = await db.query(query, params);
    return data[0];
  }

  static async updateAccess(params) {
    const query = `--sql
            UPDATE access SET   
                kassa = $1,
                bank = $2,
                jur3 = $3,
                jur4 = $4,
                jur5 = $5,
                jur7 = $6,
                jur8 = $7,
                spravochnik = $8,
                region = $9,
                main_book = $10,
                smeta_grafik = $11,
                odinox = $12,
                updated_at = $13
            WHERE id = $14
            RETURNING id
        `;
    const data = await db.query(query, params);
    return data[0];
  }
};
