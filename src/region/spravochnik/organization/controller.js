const { OrganizationSchema } = require('./schema');
const { OrganizationService } = require('./service');
const { BankService } = require('@bank/service');

exports.Controller = class {
    static async setParentId(req, res) {
        const region_id = req.user.region_id;

        const { parent_id, organization_ids } = req.body;

        const organization = await OrganizationService.getById({ region_id, id: parent_id })
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        for (let doc of organization_ids) {
            const organization = await OrganizationService.getById({ region_id, id: doc.id })
            if (!organization) {
                return res.error(req.i18n.t('organizationNotFound'), 404);
            }
        }

        const response = await OrganizationService.setParentId(req.body);

        return res.success(req.i18n.t('getSuccess'), 200, null, response);
    }

    static async template(req, res) {
        const { fileName, fileRes } = await OrganizationService.templateFile();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(fileRes);
    }

    static async create(req, res) {
        const user_id = req.user.id;

        const result = await OrganizationService.create({ ...req.body, user_id });

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }

    static async get(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search, parent, parent_id } = req.query;
        const offset = (page - 1) * limit;

        if (parent_id) {
            const organization = await OrganizationService.getById({ region_id, id: parent_id })
            if (!organization) {
                return res.error(req.i18n.t('organizationNotFound'), 404);
            }
        }

        const { data, total } = await OrganizationService.get({ region_id, search, offset, limit, parent, parent_id });

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: Number(page) === 1 ? null : page - 1,
        }

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async update(req, res) {
        const id = req.params.id;
        const region_id = req.user.region_id;

        const { gaznas, account_numbers } = req.body;

        const old_data = await OrganizationService.getById({ region_id, id });
        if (!old_data) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        for (let gazna of gaznas) {
            if (gazna.id) {
                const check = old_data.gaznas.find(item => item.id === gazna.id);
                if (!check) {
                    return res.error(req.i18n.t('gazna_not_found'), 404);
                }
            }
        }

        for (let acccount_number of account_numbers) {
            if (acccount_number.id) {
                const check = old_data.account_numbers.find(item => item.id === acccount_number.id);
                if (!check) {
                    return res.error(req.i18n.t('account_number_not_found'), 404);
                }
            }
        }

        const result = await OrganizationService.update({ id, ...req.body, old_data });

        return res.success(req.i18n.t('updateSuccess'), 200, null, result);
    }

    static async delete(req, res) {
        const id = req.params.id;
        const region_id = req.user.region_id;

        const old_data = await OrganizationService.getById({ region_id, id });

        if (!old_data) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        const result = await OrganizationService.delete({ id });

        return res.success(req.i18n.t('deleteSuccess'), 200, null, result);
    }

    static async getById(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;

        const result = await OrganizationService.getById({ region_id, id, isdeleted: true });
        if (!result) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }

    static async import(req, res) {
        const filePath = req.file.path;
        const user_id = req.user.id;

        const data = await OrganizationService.readFile({ filePath });

        const { error, value } = OrganizationSchema.importData(req.i18n).validate(data);
        if (error) {
            return res.error(error.details[0].message, 400);
        }

        for (let item of data) {
            const bank = await BankService.getByMfo({ mfo: item.mfo });
            if (!bank) {
                return res.error(req.i18n.t('bankNotFound'), 404, { doc: item.mfo });
            }

            item.bank_klient = bank.name;
        }

        await OrganizationService.import({ data: value, user_id });

        return res.success(req.i18n.t('importSuccess'), 201);
    }
}
