
const { returnParamsValues } = require('../../helper/functions')
const { db } = require('../../db/index')

exports.AccessDB = class {
    static async createAccess(params, client) {
        const values = returnParamsValues(params, 4);
        const query = `INSERT INTO access (role_id, region_id, created_at, updated_at) VALUES ${values}`;
        const result = await client.query(query, params);
        return result;
    }

    static async deleteAccess(params, client) {
        const query = `UPDATE access SET isdeleted = true WHERE role_id = $1`;
        await client.query(query, params)
    }

    static async getByRoleIdAccess(params, region_id) {
        let index_region_id;
        if (region_id) {
            params.push(region_id);
            index_region_id = params.length;
        }
    
        const query = `--sql
            SELECT a.*, r.name AS role_name
            FROM access AS a
            JOIN role AS r ON r.id = a.role_id
            WHERE r.id = $1 ${region_id ? `AND a.region_id = $${index_region_id}` : ""};
        `;
    
        const data = await db.query(query, params);
        return data[0];
    }  

    static async updateAccess(params) {
        const query = `--sql
            UPDATE access SET   
              role_get = $1,
              users_create = $2,
              users_update = $3,
              users_get = $4,
              users_delete = $5,
              budjet_get = $6,
              access_update = $7,
              access_get = $8,
              main_schet_get = $9,
              operatsii_get = $10,
              organization_create = $11,
              organization_update = $12,
              organization_get = $13,
              organization_delete = $14,
              podotchet_create = $15,
              podotchet_update = $16,
              podotchet_get = $17,
              podotchet_delete = $18,
              podpis_create = $19,
              podpis_update = $20,
              podpis_get = $21,
              podpis_delete = $22,
              podrazdelenie_create = $23,
              podrazdelenie_update = $24,
              podrazdelenie_get = $25,
              podrazdelenie_delete = $26,
              sostav_create = $27,
              sostav_update = $28,
              sostav_get = $29,
              sostav_delete = $30,
              type_operatsii_create = $31,
              type_operatsii_update = $32,
              type_operatsii_get = $33,
              type_operatsii_delete = $34,
              akt_create = $35,
              akt_update = $36,
              akt_get = $37,
              akt_delete = $38,
              avans_create = $39,
              avans_update = $40,
              avans_get = $41,
              avans_delete = $42,
              bank_prixod_create = $43,
              bank_prixod_update = $44,
              bank_prixod_get = $45,
              bank_prixod_delete = $46,
              bank_rasxod_create = $47,
              bank_rasxod_update = $48,
              bank_rasxod_get = $49,
              bank_rasxod_delete = $50,
              bank_monitoring = $51,
              internal_j7_create = $52,
              internal_j7_update = $53,
              internal_j7_get = $54,
              internal_j7_delete = $55,
              prixod_j7_create = $56,
              prixod_j7_update = $57,
              prixod_j7_get = $58,
              prixod_j7_delete = $59,
              rasxod_j7_create = $60,
              rasxod_j7_update = $61,
              rasxod_j7_get = $62,
              rasxod_j7_delete = $63,
              iznos_j7 = $64,
              group_j7_create = $65,
              group_j7_update = $66,
              group_j7_get = $67,
              group_j7_delete = $68,
              product_j7_create = $69,
              product_j7_update = $70,
              product_j7_get = $71,
              product_j7_delete = $72,
              pereotsenka_j7_create = $73,
              pereotsenka_j7_update = $74,
              pereotsenka_j7_get = $75,
              pereotsenka_j7_delete = $76,
              podrazdelenie_j7_create = $77,
              podrazdelenie_j7_update = $78,
              podrazdelenie_j7_get = $79,
              podrazdelenie_j7_delete = $80,
              responsible_j7_create = $81,
              responsible_j7_update = $82,
              responsible_j7_get = $83,
              responsible_j7_delete = $84,
              kassa_prixod_create = $85,
              kassa_prixod_update = $86,
              kassa_prixod_get = $87,
              kassa_prixod_delete = $88,
              kassa_rasxod_create = $89,
              kassa_rasxod_update = $90,
              kassa_rasxod_get = $91,
              kassa_rasxod_delete = $92,
              kassa_monitoring = $93,
              organ_monitoring = $94,
              podotchet_monitoring = $95,
              shartnoma_create = $96,
              shartnoma_update = $97,
              shartnoma_get = $98,
              shartnoma_delete = $99,
              shartnoma_grafik_create = $100,
              shartnoma_grafik_update = $101,
              shartnoma_grafik_get = $102,
              shartnoma_grafik_delete = $103,
              show_service_create = $104,
              show_service_update = $105,
              show_service_get = $106,
              show_service_delete = $107,
              smeta_get = $108,
              smeta_grafik_create = $109,
              smeta_grafik_update = $110,
              smeta_grafik_get = $111,
              smeta_grafik_delete = $112,
              unit_storage_j7_get = $113,
              main_schet_create = $114,
              main_schet_update = $115,
              main_schet_delete = $116,
              updated_at = $117
            WHERE id = $118
            RETURNING *
        `;
        const data = await db.query(query, params)
        return data[0];
    }
    
    static async getByIdAccess(params, isdeleted) {
        const query = `SELECT * FROM access WHERE region_id = $1 AND access.id = $2`;
        const data = await db.query(query, params)
        return data[0];
    }
}
