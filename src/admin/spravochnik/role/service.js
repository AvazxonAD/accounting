const { RoleDB } = require('@role/db')
const { tashkentTime } = require('@helper/functions')
const { AccessDB } = require('@access/db')
const { db } = require('@db/index')
const { RegionDB } = require('@region/db')
const { logRequest } = require('@helper/log')

exports.RoleService = class {
    static async createRole(req, res) {
        const { name } = req.body;
        const existRole = await RoleDB.getByNameRole([name]);
        if (existRole) {
            return res.status(409).json({
                message: "This data already exists"
            })
        }
        let result = null;
        await db.transaction(async (client) => {
            result = await RoleDB.createRole([name, tashkentTime(), tashkentTime()], client);
            const regions = await RegionDB.getRegion([0, 9999], null, client)
            const params = regions.data.reduce((acc, obj) => {
                return acc.concat(result.id, obj.id, tashkentTime(), tashkentTime())
            }, [])
            await AccessDB.createAccess(params, client)
        })
        logRequest('post', 'role', result.id, req.user.id)
        return res.status(201).json({
            message: "role created sucessfully",
            data: result
        })
    }

    static async getRole(req, res) {
        const { page, limit, search } = req.query;

        const offset = (page - 1) * limit;

        const { data, total } = await RoleDB.getRole([offset, limit], search);

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
        }

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async getByIdRole(req, res) {
        const id = req.params.id
        const data = await RoleDB.getByIdRole([id], true)
        if (!data) {
            return res.status(404).json({
                message: "role not found"
            })
        }
        return res.status(200).json({
            message: "role get successfully",
            data
        })
    }

    static async updateRole(req, res) {
        const id = req.params.id;
        const { name } = req.body;
        const old_data = await RoleDB.getByIdRole([id])
        if (!old_data) {
            return res.status(404).json({
                message: "role not found!"
            })
        }
        if (old_data.name !== name) {
            const existRole = await RoleDB.getByNameRole([name]);
            if (existRole) {
                return res.status(409).json({
                    message: "This data already exists"
                })
            }
        }
        const data = await RoleDB.updateRole([name, tashkentTime(), id])
        return res.status(200).json({
            message: 'update role successfully',
            data
        })
    }

    static async deleteRole(req, res) {
        const id = req.params.id;
        const data = await RoleDB.getByIdRole([id])
        if (!data) {
            return res.status(404).json({
                message: "role not found!"
            })
        }
        await db.transaction(async (client) => {
            await RoleDB.deleteRole([id], client)
            await AccessDB.deleteAccess([id], client)
        })

        return res.status(200).json({
            message: 'delete role successfully'
        })
    }
}