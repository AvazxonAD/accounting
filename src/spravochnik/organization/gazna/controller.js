const { GaznaService } = require('./service');
const { OrganizationService } = require('../service');


exports.Controller = class {
    static async template(req, res) {
        const { fileName, fileRes } = await GaznaService.templateFile();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(fileRes);
    }

    static async create(req, res) {
        const user_id = req.user.id;
        const region_id = req.user.region_id;
        const { spravochnik_organization_id, raschet_schet_gazna } = req.body;

        const organization = await OrganizationService.getById({ region_id, id: spravochnik_organization_id })
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        const checkGazna = await GaznaService.getByGazna({ raschet_schet_gazna, spravochnik_organization_id });
        if (checkGazna) {
            return res.error(`${req.i18n.t('gaznaExists')} Ganza: ${raschet_schet_gazna}`, 409);
        }

        const result = await GaznaService.create({ ...req.body, user_id });

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }

    static async get(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;

        const { data, total } = await GaznaService.get({ region_id, search, offset, limit });

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
        const old_data = await GaznaService.getById({ id });
        if (!old_data) {
            return res.error(req.i18n.t('gaznaNotFound'), 404);
        }

        const { spravochnik_organization_id, raschet_schet_gazna } = req.body;

        const organization = await OrganizationService.getById({ region_id, id: spravochnik_organization_id })
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        if (old_data.gazna.raschet_schet_gazna !== raschet_schet_gazna) {
            const checkGazna = await GaznaService.getByGazna({ raschet_schet_gazna, spravochnik_organization_id });
            if (checkGazna) {
                return res.error(`${req.i18n.t('gaznaExists')} Ganza: ${raschet_schet_gazna}`, 409);
            }
        }

        const result = await GaznaService.update({ id, ...req.body });

        return res.success(req.i18n.t('updateSuccess'), 200, null, result);
    }

    static async delete(req, res) {
        const id = req.params.id;

        const old_data = await GaznaService.getById({ id });

        if (!old_data) {
            return res.error(req.i18n.t('gaznaNotFound'), 404);
        }

        const result = await GaznaService.delete({ id });

        return res.success(req.i18n.t('deleteSuccess'), 200, null, result);
    }

    static async getById(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;

        const result = await GaznaService.getById({ region_id, id, isdeleted: true });
        if (!result) {
            return res.error(req.i18n.t('gaznaNotFound'), 404);
        }

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }

    static async import(req, res) {
        const filePath = req.file.path;
        const user_id = req.user.id;

        const data = await GaznaService.readFile({ filePath });

        await GaznaService.import({ data, user_id });

        return res.success(req.i18n.t('importSuccess'), 201);
    }
}
