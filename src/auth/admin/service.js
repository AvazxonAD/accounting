const { RoleDB } = require('../role/db')
const { tashkentTime } = require('../../helper/functions')
const { AdminDB } = require('./db')
const { AuthDB } = require('../auth/db')
const bcrypt = require('bcrypt')

exports.AdminService = class {
    static async createAdmin(req, res) {
        const { login, password, fio, region_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existLogin = await AuthDB.getByLoginAuth([login]);
        if (existLogin) {
            return res.status(409).json({
                message: "this login already exists"
            })
        }
        const existAdmin = await AdminDB.isExistsAdmin([region_id])
        if (existAdmin) {
            return res.status(409).json({
                message: "There is already an admin in this region"
            })
        }
        const admin_role = await RoleDB.getAdminRole()
        const result = await AdminDB.createAdmin([login, hashedPassword, fio, admin_role.id, region_id, tashkentTime(), tashkentTime()]);
        return res.status(201).json({
            message: "admin created sucessfully",
            data: result
        })
    }

    static async getAdmin(req, res) {
        const { search } = req.query
        const admins = await AdminDB.getAdmin([], search)
        return res.status(200).json({
            message: "Admins get successfully",
            data: admins
        })
    }

    static async getByIdAdmin(req, res) {
        const id = req.params.id
        const data = await AdminDB.getByIdAdmin([id], true)
        if (!data) {
            return res.status(404).json({
                message: "admin not found"
            })
        }
        return res.status(200).json({
            message: "admin get successfully",
            data
        })
    }

    static async updateAdmin(req, res) {
        const { login, password, fio, region_id } = req.body;
        const id = req.params.id;
        const admin = await AdminDB.getByIdAdmin([id])
        if (!admin) {
            return res.status(404).json({
                message: "admin not found"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (login !== admin.login) {
            const existLogin = await AuthDB.getByLoginAuth([login]);
            if (existLogin) {
                return res.status(409).json({
                    message: "this login already exists"
                })
            }
        }
        if (region_id !== admin.region_id) {
            const existAdmin = await AdminDB.isExistsAdmin([region_id])
            if (existAdmin) {
                return res.status(409).json({
                    message: "There is already an admin in this region"
                })
            }
        }
        const data = await AdminDB.updateAdmin([login, hashedPassword, fio, region_id, tashkentTime(), id])
        return res.status(200).json({
            message: 'update admin successfully',
            data
        })
    }

    static async deleteAdmin(req, res) {
        const id = req.params.id;
        const data = await AdminDB.getByIdAdmin([id])
        if (!data) {
            return res.status(404).json({
                message: "admin not found!"
            })
        }
        await AdminDB.deleteAdmin([id])
        return res.status(200).json({
            message: 'delete admin successfully'
        })
    }
}