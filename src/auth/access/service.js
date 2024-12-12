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