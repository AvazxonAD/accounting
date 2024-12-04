const { AccessDB } = require('./db')
const { tashkentTime } = require('../../helper/functions')
const { RoleDB } = require('../role/db')

exports.AccessService = class {
    static async updateAccess(req, res) {
        const {
            kassa,
            bank,
            spravochnik,
            organization_monitoring,
            region_users,
            smeta,
            region,
            role,
            users,
            shartnoma,
            jur3,
            jur4,
            podotchet_monitoring,
            budjet,
            access,
            smeta_grafik,
            jur152,
            jur7
        } = req.body;
        const region_id = req.user.region_id
        const access_id = req.params.id
        const old_data = await AccessDB.getByIdAccess([region_id, access_id])
        if (!old_data) {
            return res.status(404).json({
                message: "access not found"
            })
        }
        const result = await AccessDB.updateAccess([
            kassa,
            bank,
            spravochnik,
            organization_monitoring,
            region_users,
            smeta,
            region,
            role,
            users,
            shartnoma,
            jur3,
            jur4,
            podotchet_monitoring,
            budjet,
            access,
            smeta_grafik,
            jur152,
            jur7,
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
            access
        })
    }
}