const xlsx = require('xlsx');
const { SmetaDB } = require('./db');
const { tashkentTime } = require('../../helper/functions')

exports.Controller = class {
    static async createSmeta(req, res) {
        const { smeta_name, smeta_number, father_smeta_name, group_number } = req.body
        const exist_smeta = await SmetaDB.getByNameSmeta([smeta_name, smeta_number, father_smeta_name, group_number]);
        if (exist_smeta) {
            return res.status(409).json({
                message: "This information already exist"
            })
        }
        const result = await SmetaDB.createSmeta([smeta_name, smeta_number, father_smeta_name, group_number, tashkentTime(), tashkentTime()]);
        return res.status(201).json({
            message: "created smeta successfully",
            data: result
        })
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
        return res.status(200).json({
            message: "get smeta successfully",
            meta,
            data
        })
    }

    static async getByIdSmeta(req, res) {
        const result = await SmetaDB.getByIdSmeta([req.params.id], true);
        if (!result) {
            return res.status(404).json({
                message: "smeta not found"
            })
        }
        return res.status(200).json({
            message: "smeta get successfully",
            data: result
        })
    }

    static async updateSmeta(req, res) {
        const id = req.params.id;
        const { smeta_name, smeta_number, father_smeta_name, group_number } = req.body;
        const smeta = await SmetaDB.getByIdSmeta([id]);
        if (!smeta) {
            return res.status(404).json({
                message: "smeta not found"
            })
        }
        if (smeta.smeta_name !== smeta_name ||
            smeta.smeta_number !== smeta_number ||
            smeta.father_smeta_name !== father_smeta_name ||
            smeta.group_number !== group_number
        ) {
            const smeta = await SmetaDB.getByNameSmeta([smeta_name, smeta_number, father_smeta_name, group_number]);
            if (smeta) {
                return res.status(409).json({
                    message: "This information already exists"
                })
            }
        }
        const result = await SmetaDB.updateSmeta([smeta_name, smeta_number, father_smeta_name, group_number, tashkentTime(), id]);
        return res.status(200).json({
            message: "smeta updagte successfully",
            data: result
        })
    }

    static async deleteSmeta(req, res) {
        const id = req.params.id;
        const smeta = await SmetaDB.getByIdSmeta([id]);
        if (!smeta) {
            return res.status(404).json({
                message: "smeta not found"
            })
        }
        await SmetaDB.deleteSmeta([id]);
        return res.status(200).json({
            message: " delete smeta successfully"
        })
    }

    static async importSmetaData(req, res) {
        if (!req.file) {
            return res.status(400).json({
                message: "file not found"
            })
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
        return res.status(200).json({
            message: "import data successfully"
        })
    }
}
