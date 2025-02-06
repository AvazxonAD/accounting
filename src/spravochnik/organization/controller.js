const { OrganizationService } = require('./service');

exports.Controller = class {
    static async template(req, res) {
        
    }

    static async create(req, res) {
        const user_id = req.user.id;
        const region_id = req.user.region_id;
        const { name, inn, parent_id } = req.body;

        if (parent_id) {
            const organization = await OrganizationService.getById([region_id, parent_id])
            if (!organization) {
                return res.error(req.i18n.t('organizationNotFound'), 404);
            }
        }

        const checkInn = await OrganizationService.getByInn({ region_id, inn });
        if (checkInn) {
            return res.error(`${req.i18n.t('organizationExists')} Inn: ${inn}`, 409);
        }

        const checkName = await OrganizationService.getByName({ region_id, name });
        if (checkName) {
            return res.error(`${req.i18n.t('organizationExists')} Name: ${name}`, 409);
        }

        const result = await OrganizationService.create({ ...req.body, user_id });

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }

    static async get(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;

        const { data, total } = await OrganizationService.get({ region_id, search, offset, limit });

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
        const old_data = await OrganizationService.getById([region_id, id]);
        if (!old_data) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        const { parent_id } = req.body;

        if (parent_id) {
            const organization = await OrganizationService.getById([region_id, parent_id])
            if (!organization) {
                return res.error(req.i18n.t('organizationNotFound'), 404);
            }
        }

        const result = await OrganizationService.update({ id, ...req.body });

        return res.success(req.i18n.t('updateSucccess'), 200, null, result);
    }

    static async delete(req, res) {
        const id = req.params.id;
        const region_id = req.user.region_id;
        const old_data = await OrganizationService.getById([region_id, id]);
        if (!old_data) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        const result = await OrganizationService.delete([id]);

        return res.success(req.i18n.t('deleteSuccess'), 200, null, result);
    }

    static async getById(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;

        const result = await OrganizationService.getById({ region_id, id }, true);
        if (!result) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        return res.status(200).json({
            message: "organization get successfully",
            data: result
        })
    }

    static async import(req, res) {
        const filePath = req.file.path;
        const user_id = req.user.id;

        const data = await OrganizationService.readFile({ filePath });

        await OrganizationService.import({ data, user_id });

        return res.success(req.i18n.t('importSuccess'), 201);
    }
}
