const { GroupService } = require('./service');
const { SmetaService } = require('@smeta/service');
const { GroupSchema } = require('./schema');


exports.Controller = class {
    static async templateFile(req, res) {
        const { fileName, fileRes } = await GroupService.templateFile();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        return res.send(fileRes);
    }

    static async create(req, res) {
        const { smeta_id } = req.body;

        const smeta = await SmetaService.getById({ id: smeta_id });
        if (!smeta) {
            return res.error('Smeta not found', 404);
        }

        const result = await GroupService.create({ ...req.body });

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }

    static async get(req, res) {
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await GroupService.get({ offset, limit, search });

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        };

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async getById(req, res) {
        const id = req.params.id;

        const data = await GroupService.getById({ id, isdeleted: true });
        if (!data) {
            return res.error(req.i18n.t('groupNotFound'), 404);
        }

        return res.success(req.i18n.t('getSuccess'), 200, req.query, data);
    }

    static async update(req, res) {
        const { smeta_id } = req.body;
        const id = req.params.id;

        const group = await GroupService.getById({ id });
        if (!group) {
            return res.error(req.i18n.t('groupNotFound'), 404);
        }

        const smeta = await SmetaService.getById({ id: smeta_id });
        if (!smeta) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
        }
        const result = await GroupService.update({ id, ...req.body });

        return res.success(req.i18n.t('updateSuccess'), 200, null, result);
    }

    static async delete(req, res) {
        const id = req.params.id;
        
        const group = await GroupService.getById({ id });
        if (!group) {
            return res.error(req.i18n.t('groupNotFound'), 404);
        }

        const result = await GroupService.delete({ id });

        return res.success(req.i18n.t('deleteSuccess'), 200, null, result);
    }

    static async getWithPercent(req, res) {
        const result = await GroupService.getWithPercent();

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }

    static async import(req, res) {
        const filePath = req.file.path;

        const data = await GroupService.readFile({ filePath });

        const { error, value } = GroupSchema.importData(req.i18n).validate(data)
        if (error) {
            return res.error(error.details[0].message, 400);
        }

        await GroupService.import({ groups: value });

        return res.success(req.i18n.t('importSuccess'), 201);
    }
};