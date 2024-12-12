// validate
const Joi = require('joi');

exports.updateAccessSchema = Joi.object({
    body: Joi.object({
        role_get: Joi.boolean().default(false),
        users_create: Joi.boolean().default(false),
        users_update: Joi.boolean().default(false),
        users_get: Joi.boolean().default(false),
        users_delete: Joi.boolean().default(false),
        budjet_get: Joi.boolean().default(false),
        access_update: Joi.boolean().default(false),
        access_get: Joi.boolean().default(false),
        main_schet_create: Joi.boolean().default(false),
        main_schet_update: Joi.boolean().default(false),
        main_schet_get: Joi.boolean().default(false),
        main_schet_delete: Joi.boolean().default(false),
        operatsii_get: Joi.boolean().default(false),
        organization_create: Joi.boolean().default(false),
        organization_update: Joi.boolean().default(false),
        organization_get: Joi.boolean().default(false),
        organization_delete: Joi.boolean().default(false),
        podotchet_create: Joi.boolean().default(false),
        podotchet_update: Joi.boolean().default(false),
        podotchet_get: Joi.boolean().default(false),
        podotchet_delete: Joi.boolean().default(false),
        podpis_create: Joi.boolean().default(false),
        podpis_update: Joi.boolean().default(false),
        podpis_get: Joi.boolean().default(false),
        podpis_delete: Joi.boolean().default(false),
        podrazdelenie_create: Joi.boolean().default(false),
        podrazdelenie_update: Joi.boolean().default(false),
        podrazdelenie_get: Joi.boolean().default(false),
        podrazdelenie_delete: Joi.boolean().default(false),
        sostav_create: Joi.boolean().default(false),
        sostav_update: Joi.boolean().default(false),
        sostav_get: Joi.boolean().default(false),
        sostav_delete: Joi.boolean().default(false),
        type_operatsii_create: Joi.boolean().default(false),
        type_operatsii_update: Joi.boolean().default(false),
        type_operatsii_get: Joi.boolean().default(false),
        type_operatsii_delete: Joi.boolean().default(false),
        akt_create: Joi.boolean().default(false),
        akt_update: Joi.boolean().default(false),
        akt_get: Joi.boolean().default(false),
        akt_delete: Joi.boolean().default(false),
        admin_create: Joi.boolean().default(false),
        admin_update: Joi.boolean().default(false),
        admin_get: Joi.boolean().default(false),
        admin_delete: Joi.boolean().default(false),
        avans_create: Joi.boolean().default(false),
        avans_update: Joi.boolean().default(false),
        avans_get: Joi.boolean().default(false),
        avans_delete: Joi.boolean().default(false),
        bank_prixod_create: Joi.boolean().default(false),
        bank_prixod_update: Joi.boolean().default(false),
        bank_prixod_get: Joi.boolean().default(false),
        bank_prixod_delete: Joi.boolean().default(false),
        bank_rasxod_create: Joi.boolean().default(false),
        bank_rasxod_update: Joi.boolean().default(false),
        bank_rasxod_get: Joi.boolean().default(false),
        bank_rasxod_delete: Joi.boolean().default(false),
        bank_monitoring: Joi.boolean().default(false),
        internal_j7_create: Joi.boolean().default(false),
        internal_j7_update: Joi.boolean().default(false),
        internal_j7_get: Joi.boolean().default(false),
        internal_j7_delete: Joi.boolean().default(false),
        prixod_j7_create: Joi.boolean().default(false),
        prixod_j7_update: Joi.boolean().default(false),
        prixod_j7_get: Joi.boolean().default(false),
        prixod_j7_delete: Joi.boolean().default(false),
        rasxod_j7_create: Joi.boolean().default(false),
        rasxod_j7_update: Joi.boolean().default(false),
        rasxod_j7_get: Joi.boolean().default(false),
        rasxod_j7_delete: Joi.boolean().default(false),
        iznos_j7: Joi.boolean().default(false),
        group_j7_create: Joi.boolean().default(false),
        group_j7_update: Joi.boolean().default(false),
        group_j7_get: Joi.boolean().default(false),
        group_j7_delete: Joi.boolean().default(false),
        product_j7_create: Joi.boolean().default(false),
        product_j7_update: Joi.boolean().default(false),
        product_j7_get: Joi.boolean().default(false),
        product_j7_delete: Joi.boolean().default(false),
        pereotsenka_j7_create: Joi.boolean().default(false),
        pereotsenka_j7_update: Joi.boolean().default(false),
        pereotsenka_j7_get: Joi.boolean().default(false),
        pereotsenka_j7_delete: Joi.boolean().default(false),
        podrazdelenie_j7_create: Joi.boolean().default(false),
        podrazdelenie_j7_update: Joi.boolean().default(false),
        podrazdelenie_j7_get: Joi.boolean().default(false),
        podrazdelenie_j7_delete: Joi.boolean().default(false),
        responsible_j7_create: Joi.boolean().default(false),
        responsible_j7_update: Joi.boolean().default(false),
        responsible_j7_get: Joi.boolean().default(false),
        responsible_j7_delete: Joi.boolean().default(false),
        unit_storage_j7_create: Joi.boolean().default(false),
        unit_storage_j7_update: Joi.boolean().default(false),
        unit_storage_j7_get: Joi.boolean().default(false),
        unit_storage_j7_delete: Joi.boolean().default(false),
        kassa_prixod_create: Joi.boolean().default(false),
        kassa_prixod_update: Joi.boolean().default(false),
        kassa_prixod_get: Joi.boolean().default(false),
        kassa_prixod_delete: Joi.boolean().default(false),
        kassa_rasxod_create: Joi.boolean().default(false),
        kassa_rasxod_update: Joi.boolean().default(false),
        kassa_rasxod_get: Joi.boolean().default(false),
        kassa_rasxod_delete: Joi.boolean().default(false),
        kassa_monitoring: Joi.boolean().default(false),
        organ_monitoring: Joi.boolean().default(false),
        podotchet_monitoring: Joi.boolean().default(false),
        shartnoma_create: Joi.boolean().default(false),
        shartnoma_update: Joi.boolean().default(false),
        shartnoma_get: Joi.boolean().default(false),
        shartnoma_delete: Joi.boolean().default(false),
        shartnoma_grafik_create: Joi.boolean().default(false),
        shartnoma_grafik_update: Joi.boolean().default(false),
        shartnoma_grafik_get: Joi.boolean().default(false),
        shartnoma_grafik_delete: Joi.boolean().default(false),
        show_service_create: Joi.boolean().default(false),
        show_service_update: Joi.boolean().default(false),
        show_service_get: Joi.boolean().default(false),
        show_service_delete: Joi.boolean().default(false),
        smeta_create: Joi.boolean().default(false),
        smeta_update: Joi.boolean().default(false),
        smeta_get: Joi.boolean().default(false),
        smeta_delete: Joi.boolean().default(false),
        smeta_grafik_create: Joi.boolean().default(false),
        smeta_grafik_update: Joi.boolean().default(false),
        smeta_grafik_get: Joi.boolean().default(false),
        smeta_grafik_delete: Joi.boolean().default(false)
    }),
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    })
}).options({ stripUnknown: true });

exports.getByRoleIdAccessSchema = Joi.object({
    query: Joi.object({
        role_id: Joi.number().integer().min(1).required()
    })
}).options({ stripUnknown: true });

// db 

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

// service 
const { AccessDB } = require('./db')
const { tashkentTime } = require('../../helper/functions')
const { RoleDB } = require('../role/db')

exports.AccessService = class {
    static async updateAccess(req, res) {
        const data = req.body;
        const region_id = req.user.region_id
        const access_id = req.params.id
        const old_data = await AccessDB.getByIdAccess([region_id, access_id])
        if (!old_data) {
            return res.status(404).json({
                message: "access not found"
            })
        }
        const result = await AccessDB.updateAccess([
            data.role_get,
            data.users_create,
            data.users_update,
            data.users_get,
            data.users_delete,
            data.budjet_get,
            data.access_update,
            data.access_get,
            data.main_schet_get,
            data.operatsii_get,
            data.organization_create,
            data.organization_update,
            data.organization_get,
            data.organization_delete,
            data.podotchet_create,
            data.podotchet_update,
            data.podotchet_get,
            data.podotchet_delete,
            data.podpis_create,
            data.podpis_update,
            data.podpis_get,
            data.podpis_delete,
            data.podrazdelenie_create,
            data.podrazdelenie_update,
            data.podrazdelenie_get,
            data.podrazdelenie_delete,
            data.sostav_create,
            data.sostav_update,
            data.sostav_get,
            data.sostav_delete,
            data.type_operatsii_create,
            data.type_operatsii_update,
            data.type_operatsii_get,
            data.type_operatsii_delete,
            data.akt_create,
            data.akt_update,
            data.akt_get,
            data.akt_delete,
            data.avans_create,
            data.avans_update,
            data.avans_get,
            data.avans_delete,
            data.bank_prixod_create,
            data.bank_prixod_update,
            data.bank_prixod_get,
            data.bank_prixod_delete,
            data.bank_rasxod_create,
            data.bank_rasxod_update,
            data.bank_rasxod_get,
            data.bank_rasxod_delete,
            data.bank_monitoring,
            data.internal_j7_create,
            data.internal_j7_update,
            data.internal_j7_get,
            data.internal_j7_delete,
            data.prixod_j7_create,
            data.prixod_j7_update,
            data.prixod_j7_get,
            data.prixod_j7_delete,
            data.rasxod_j7_create,
            data.rasxod_j7_update,
            data.rasxod_j7_get,
            data.rasxod_j7_delete,
            data.iznos_j7,
            data.group_j7_create,
            data.group_j7_update,
            data.group_j7_get,
            data.group_j7_delete,
            data.product_j7_create,
            data.product_j7_update,
            data.product_j7_get,
            data.product_j7_delete,
            data.pereotsenka_j7_create,
            data.pereotsenka_j7_update,
            data.pereotsenka_j7_get,
            data.pereotsenka_j7_delete,
            data.podrazdelenie_j7_create,
            data.podrazdelenie_j7_update,
            data.podrazdelenie_j7_get,
            data.podrazdelenie_j7_delete,
            data.responsible_j7_create,
            data.responsible_j7_update,
            data.responsible_j7_get,
            data.responsible_j7_delete,
            data.kassa_prixod_create,
            data.kassa_prixod_update,
            data.kassa_prixod_get,
            data.kassa_prixod_delete,
            data.kassa_rasxod_create,
            data.kassa_rasxod_update,
            data.kassa_rasxod_get,
            data.kassa_rasxod_delete,
            data.kassa_monitoring,
            data.organ_monitoring,
            data.podotchet_monitoring,
            data.shartnoma_create,
            data.shartnoma_update,
            data.shartnoma_get,
            data.shartnoma_delete,
            data.shartnoma_grafik_create,
            data.shartnoma_grafik_update,
            data.shartnoma_grafik_get,
            data.shartnoma_grafik_delete,
            data.show_service_create,
            data.show_service_update,
            data.show_service_get,
            data.show_service_delete,
            data.smeta_get,
            data.smeta_grafik_create,
            data.smeta_grafik_update,
            data.smeta_grafik_get,
            data.smeta_grafik_delete,
            data.unit_storage_j7_get,
            data.main_schet_create,
            data.main_schet_update,
            data.main_schet_delete,
            tashkentTime(),
            access_id
        ])
        return res.status(200).json({
            message: 'update seccessfully !',
            data: result
        })
    }

    static async getByRoleIdAccess(req, res) {
        const region_id = req.user.region_id
        const { role_id } = req.query
        const role = await RoleDB.getByIdRole([role_id])
        if (!role) {
            return res.status(404).json({
                message: "role not found"
            })
        }
        const access = await AccessDB.getByRoleIdAccess([role_id], region_id);
        if (!access) {
            return res.status(404).json({
                message: 'access not found'
            })
        }
        return res.status(200).json({
            message: "access get successfully!",
            data: access
        })
    }
}