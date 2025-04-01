const { AccountNumberService } = require('./service');
const { OrganizationService } = require('../service');


exports.Controller = class {
    static async template(req, res) {
        const { fileName, fileRes } = await AccountNumberService.templateFile();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(fileRes);
    }

    static async create(req, res) {
        const user_id = req.user.id;
        const region_id = req.user.region_id;
        const { spravochnik_organization_id, raschet_schet } = req.body;

        const organization = await OrganizationService.getById({ region_id, id: spravochnik_organization_id })
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        const checkAccountNumber = await AccountNumberService.getByAccountNumber({ raschet_schet, spravochnik_organization_id });
        if (checkAccountNumber) {
            return res.error(`${req.i18n.t('gaznaExists')} Ganza: ${raschet_schet}`, 409);
        }

        const result = await AccountNumberService.create({ ...req.body, user_id });

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }

    static async get(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, organ_id } = req.query;
        const offset = (page - 1) * limit;

        if (organ_id) {
            const organization = await OrganizationService.getById({ region_id, id: organ_id });
            if(!organization){
                return res.error(req.i18n.t('organizationNotFound'), 404);
            }
        }


        const { data, total } = await AccountNumberService.get({ region_id, offset, ...req.query });

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
        const old_data = await AccountNumberService.getById({ id });
        if (!old_data) {
            return res.error(req.i18n.t('account_number_not_found'), 404);
        }

        const { spravochnik_organization_id, raschet_schet } = req.body;

        const organization = await OrganizationService.getById({ region_id, id: spravochnik_organization_id })
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        if (old_data.account_number.raschet_schet !== raschet_schet) {
            const checkAccountNumber = await AccountNumberService.getByAccountNumber({ raschet_schet, spravochnik_organization_id });
            if (checkAccountNumber) {
                return res.error(`${req.i18n.t('gaznaExists')} Ganza: ${raschet_schet}`, 409);
            }
        }

        const result = await AccountNumberService.update({ id, ...req.body });

        return res.success(req.i18n.t('updateSuccess'), 200, null, result);
    }

    static async delete(req, res) {
        const id = req.params.id;

        const old_data = await AccountNumberService.getById({ id });

        if (!old_data) {
            return res.error(req.i18n.t('account_number_not_found'), 404);
        }

        const result = await AccountNumberService.delete({ id });

        return res.success(req.i18n.t('deleteSuccess'), 200, null, result);
    }

    static async getById(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;

        const result = await AccountNumberService.getById({ region_id, id, isdeleted: true });
        if (!result) {
            return res.error(req.i18n.t('account_number_not_found'), 404);
        }

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }

    static async import(req, res) {
        const filePath = req.file.path;
        const user_id = req.user.id;

        const data = await AccountNumberService.readFile({ filePath });

        await AccountNumberService.import({ data, user_id });

        return res.success(req.i18n.t('importSuccess'), 201);
    }
}
