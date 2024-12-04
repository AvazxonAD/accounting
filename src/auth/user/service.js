const { RoleDB } = require('../role/db')
const { tashkentTime } = require('../../helper/functions')
const { UserDB } = require('./db')
const { AuthDB } = require('../auth/db')
const bcrypt = require('bcrypt')

exports.UserService = class {
    static async createUser(req, res) {
        const region_id = req.user.region_id
        const { login, password, fio, role_id } = req.body;
        const role = await RoleDB.getByIdRole([role_id])
        if (!role || role.name === 'super-admin' || role.name === 'region-admin') {
            return res.status(404).json({
                message: "role not found"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const existLogin = await AuthDB.getByLoginAuth([login]);
        if (existLogin) {
            return res.status(409).json({
                message: "this login already exists"
            })
        }
        const result = await UserDB.createUser([login, hashedPassword, fio, role_id, region_id, tashkentTime(), tashkentTime()]);
        return res.status(201).json({
            message: "user created sucessfully",
            data: result
        })
    }

    static async getUser(req, res) {
        const roles = await UserDB.getUser([req.user.region_id])
        return res.status(200).json({
            message: "Users get successfully",
            data: roles
        })
    }

    static async getByIdUser(req, res) {
        const id = req.params.id
        const data = await UserDB.getByIdUser([id], true)
        if (!data) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json({
            message: "user get successfully",
            data
        })
    }

    static async updateUser(req, res) {
        const { login, password, fio, role_id } = req.body;
        const id = req.params.id;
        const user = await UserDB.getByIdUser([id])
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        const role = await RoleDB.getByIdRole([role_id])
        if (!role || role.name === 'super-admin' || role.name === 'region-admin') {
            return res.status(404).json({
                message: "role not found"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (login !== user.login) {
            const existLogin = await AuthDB.getLoginAuth([login]);
            if (existLogin) {
                return res.status(409).json({
                    message: "this login already exists"
                })
            }
        }
        const data = await UserDB.updateUser([login, hashedPassword, fio, role_id, tashkentTime(), id])
        return res.status(200).json({
            message: 'update user successfully',
            data
        })
    }

    static async deleteUser(req, res) {
        const id = req.params.id;
        const data = await UserDB.getByIdUser([id])
        if (!data) {
            return res.status(404).json({
                message: "user not found!"
            })
        }
        await UserDB.deleteUser([id])
        return res.status(200).json({
            message: 'delete user successfully'
        })
    }
}