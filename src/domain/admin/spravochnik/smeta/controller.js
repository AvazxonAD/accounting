const xlsx = require('xlsx');
const { SmetaDB } = require('./db');
const { tashkentTime } = require('@helper/functions')

exports.Controller = class {
    static async createSmeta(req, res) {
        const { smeta_name, smeta_number, father_smeta_name, group_number } = req.body
        
        const exist_smeta = await SmetaDB.getByNameSmeta([smeta_name, smeta_number, father_smeta_name, group_number]);
        if (exist_smeta) {
            return res.error(req.i18n.t('docExists'), 409);
        }

        const result = await SmetaDB.createSmeta([smeta_name, smeta_number, father_smeta_name, group_number, tashkentTime(), tashkentTime()]);
        
        return res.success(req.i18n.t(`createSuccess`), 201, null, result);
    }
    static async getSmeta(req, res) {
        const { page, limit, search, group_number } = req.query
        const offset = (page - 1) * limit;
        const { data, total } = await SmetaDB.getSmeta([offset, limit], search, group_number);
        
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async getById(req, res) {
        const result = await SmetaDB.getById([req.params.id], true);
        if (!result) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }
        
        return res.success(req.i18n.t('getSuccess'), 200, null, result)
    }

    static async updateSmeta(req, res) {
        const id = req.params.id;
        const { smeta_name, smeta_number, father_smeta_name, group_number } = req.body;
        const smeta = await SmetaDB.getById([id]);
        if (!smeta) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }
        if (smeta.smeta_name !== smeta_name ||
            smeta.smeta_number !== smeta_number ||
            smeta.father_smeta_name !== father_smeta_name ||
            smeta.group_number !== group_number
        ) {
            const smeta = await SmetaDB.getByNameSmeta([smeta_name, smeta_number, father_smeta_name, group_number]);
            if (smeta) {
                return res.error(req.i18n.t('docExists'), 409);
            }
        }

        const result = await SmetaDB.updateSmeta([smeta_name, smeta_number, father_smeta_name, group_number, tashkentTime(), id]);
        
        return res.success(req.i18n.t('updateSuccess'), 200, null, result);
    }

    static async deleteSmeta(req, res) {
        const id = req.params.id;
        const smeta = await SmetaDB.getById([id]);
        if (!smeta) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }

        const result = await SmetaDB.deleteSmeta([id]);
        
        return res.success(req.i18n.t(req.i18n.t('deleteSuccess')), 200, null, result)
    }

    static async importSmetaData(req, res) {
        if (!req.file) {
            return res.error(req.i18n.t('fileError'), 400);
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

        for (let smeta of data) {
            await SmetaDB.createSmeta([
                smeta.smeta_name ? String(smeta.smeta_name).trim() : '',
                smeta.smeta_number ? String(smeta.smeta_number).replace(/\s+/g, '') : '',
                smeta.father_smeta_name ? String(smeta.father_smeta_name).trim() : '',
                smeta.group_number ? String(smeta.group_number).trim() : '',
                tashkentTime(),
                tashkentTime()
            ]);
        }
        return res.success(req.i18n.t('importSuccess'), 200);
    }
}
