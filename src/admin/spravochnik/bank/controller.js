const { ReportTitleService } = require('./service');
const { tashkentTime } = require('@helper/functions');
const xlsx = require('xlsx')

exports.Controller = class {
    static async create(req, res) {
        const { name } = req.body;
        const check = await ReportTitleService.getByName({ name })
        if (check) {
            return res.error(req.i18n.t('ReportTitleAlreadyExists'), 409);
        }

        const result = await ReportTitleService.create({ name });

        return res.success(req.i18n.t('creareSuccess'), 201, null, result);
    }

    static async get(req, res) {
        const { page, limit, search } = req.query;

        const offset = (page - 1) * limit;

        const { data, total } = await ReportTitleService.get({ offset, limit, search });

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
        const data = await ReportTitleService.getById({ id, isdeleted: true });
        if (!data) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }

        return res.success(req.i18n.t('getSuccess'), 200, null, data);
    }

    static async update(req, res) {
        const { name } = req.body;
        const id = req.params.id;

        const old_data = await ReportTitleService.getById({ id });
        if (!old_data) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }

        if (old_data.name !== name) {
            const check = await ReportTitleService.getByName({ name })
            if (check) {
                return res.error(req.i18n.t('ReportTitleAlreadyExists'), 409);
            }
        }

        const result = await ReportTitleService.update({ name, id });

        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async delete(req, res) {
        const id = req.params.id;
        const old_data = await ReportTitleService.getById({ id });
        if (!old_data) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }

        await ReportTitleService([id]);
        return res.status(200).json({
            message: 'Delete bank mfo successfully'
        });
    }

    static async importExcelData(req, res) {
        if (!req.file) {
            return next(new ErrorResponse("File not found", 400));
        }
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet).map((row) => {
            const newRow = {};
            for (const key in row) {
                newRow[key.trim()] = row[key];
            }
            return newRow;
        });
        for (let bank of data) {
            await ReportTitleService.create([
                String(bank.mfo).trim(),
                String(bank.name).trim(),
                tashkentTime(),
                tashkentTime()
            ]);
        }
        return res.status(200).json({
            message: "'Created successfully!"
        })
    }
}