const { RegionDB } = require('./db')
const { RoleDB } = require('../role/db')
const { tashkentTime } = require('../../helper/functions')
const { AccessDB } = require('../access/db')
const { db } = require('../../db/index')

exports.RegionService = class {
    static async createRegion(req, res) {
        const { name } = req.body;
        const existRegion = await RegionDB.getByNameRegion([name]);
        if (existRegion) {
            return res.status(409).json({
                message: "This data already exists"
            })
        }
        let result = null;
        await db.transaction(async (client) => {
            result = await RegionDB.createRegion([name, tashkentTime(), tashkentTime()], client);
            const roles = await RoleDB.getRole(client)
            const params = roles.reduce((acc, obj) => {
                return acc.concat(obj.id, result.id, tashkentTime(), tashkentTime())
            }, [])
            await AccessDB.createAccess(params, client)
        })
        return res.status(201).json({
            message: "region created sucessfully",
            data: result
        })
    }

    static async getRegion(req, res) {
        const regions = await RegionDB.getRegion()
        return res.status(200).json({
            message: "Regions get successfully",
            data: regions
        })
    }

    static async getByIdRegion(req, res) {
        const id = req.params.id
        const data = await RegionDB.getByIdRegion([id], true)
        return res.status(200).json({
            message: "region get successfully",
            data
        })
    }

    static async updateRegion(req, res) {
        const id = req.params.id;
        const { name } = req.body;
        const old_data = await RegionDB.getByIdRegion([id])
        if (!old_data) {
            return res.status(404).json({
                message: "region not found!"
            })
        }
        if (old_data.name !== name) {
            const existRegion = await RegionDB.getByNameRegion([name]);
            if (existRegion) {
                return res.status(409).json({
                    message: "This data already exists"
                })
            }
        }
        const data = await RegionDB.updateRegion([name, tashkentTime(), id])
        return res.status(200).json({
            message: 'update region successfully',
            data
        })
    }

    static async deleteRegion(req, res) {
        const id = req.params.id;
        const data = await RegionDB.getByIdRegion([id])
        if (!data) {
            return res.status(404).json({
                message: "region not found!"
            })
        }
        await db.transaction(async (client) => {
            await RegionDB.deleteRegion([id], client)
            await AccessDB.deleteAccess([id], client)
        })

        return res.status(200).json({
            message: 'delete region successfully'
        })
    }
}