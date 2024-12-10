const { OrganizationDB } = require('./db')
const { tashkentTime } = require('../../helper/functions')

exports.OrganizationService = class {
    static async createOrganization(req, res) {
        const user_id = req.user.id;
        const {
            name, bank_klient,
            raschet_schet,
            raschet_schet_gazna,
            mfo, inn, okonx, parent_id
        } = req.body;
        const result = await OrganizationDB.createOrganization([
            name, bank_klient, raschet_schet,
            raschet_schet_gazna, mfo, inn, user_id,
            okonx, parent_id, tashkentTime(), tashkentTime()
        ]);
        return res.status(201).json({
            message: "Organization created successfully!",
            data: result
        })
    }

    static async getOrganization(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { result, total } = await OrganizationDB.getOrganizationDataAndTotal([region_id, offset, limit], search);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: Number(page) === 1 ? null : page - 1,
        }
        return res.status(200).json({
            message: "get organization successfully!",
            meta, data: result
        })
    }

    static async updateOrganization(req, res) {
        const id = req.params.id;
        const region_id = req.user.region_id;
        const old_data = await OrganizationDB.getByIdorganization([region_id, id]);
        if (!old_data) {
            return res.status(404).json({
                message: "organziation not found"
            })
        }
        const {
            name, bank_klient, raschet_schet,
            raschet_schet_gazna, mfo, inn, okonx
        } = req.body;
        const result = await OrganizationDB.updateOrganization([
            name, bank_klient, raschet_schet,
            raschet_schet_gazna, mfo, inn, okonx, id
        ]);
        return res.status(200).json({
            message: 'update organization successfully!',
            data: result
        })
    }

    static async deleteOrganization(req, res) {
        const id = req.params.id;
        const region_id = req.user.region_id;
        const old_data = await OrganizationDB.getByIdorganization([region_id, id]);
        if (!old_data) {
            return res.status(404).json({
                message: "organization not found"
            })
        }
        await OrganizationDB.deleteOrganization([id]);
        return res.status(200).json({
            message: 'delete organization successfully'
        })
    }

    static async getByIdOrganization(req, res) {
        const result = await OrganizationDB.getByIdorganization([req.user.region_id, req.params.id], true);
        if (!result) {
            return res.status(404).json({
                message: "organization not found"
            })
        }
        return res.status(200).json({
            message: "organization get successfully",
            data: result
        })
    }

}
