const { OrganizationDB } = require('./db')
const { tashkentTime } = require('../../helper/functions')

exports.OrganizationService = class {
    static async getByInnAndAccountNumber(data) {
        const result = await OrganizationDB.getByInnAndAccountNumber([data.region_id, data.inn, data.account_number]);
        return result;
    }

    static async createOrganization(req, res) {
        const user_id = req.user.id;
        const {
            name, bank_klient,
            raschet_schet,
            raschet_schet_gazna,
            mfo, inn, okonx, parent_id
        } = req.body;
        if (parent_id) {
            const organization = await OrganizationDB.getByIdorganization([region_id, parent_id])
            if (!organization) {
                return res.status(404).json({
                    message: "organization not found"
                })
            }
        }
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

    static async getOrganization(data) {
        const result = await OrganizationDB.getOrganizationDataAndTotal([data.region_id, data.offset, data.limit], data.search, data.organ_id);
        return result;
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
            raschet_schet_gazna, mfo, inn, okonx, parent_id
        } = req.body;

        if (parent_id) {
            const organization = await OrganizationDB.getByIdorganization([region_id, parent_id])
            if (!organization) {
                return res.status(404).json({
                    message: "organization not found"
                })
            }
        }
        const result = await OrganizationDB.updateOrganization([
            name, bank_klient, raschet_schet,
            raschet_schet_gazna, mfo, inn, okonx, parent_id, id
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

    static async getByIdOrganization(data) {
        const result = await OrganizationDB.getByIdorganization([data.region_id, data.id], data.isdeleted);
        return result;
    }

}
