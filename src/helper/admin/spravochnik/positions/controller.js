const { MainBookSchetDB } = require('./db');
const { tashkentTime } = require('@helper/functions');
const xlsx = require('xlsx');

exports.Controller = class {
    static async createMainBookSchet(req, res) {
        const { name, schet } = req.body;
        const check = await MainBookSchetDB.getByNameMainBookSchet([schet]);
        if(check){
            return res.status(409).json({
                message: "this data already exists"
            })
        }
        const result = await MainBookSchetDB.createMainBookSchet([
            name,
            schet,
            tashkentTime(),
            tashkentTime()
        ])
        return res.status(201).json({
            message: "Create main book schet successfully",
            data: result
        })
    }

    static async getMainBookSchet(req, res) {
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await MainBookSchetDB.getMainBookSchet([offset, limit], search)
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }
        return res.status(200).json({
            message: "main book schet successfully get",
            meta,
            data: data || []
        })
    }

    static async getByIdMainBookSchet(req, res) {
        const id = req.params.id
        const data = await MainBookSchetDB.getByIdMainBookSchet([id], true);
        if (!data) {
            return res.status(404).json({
                message: "main book schet not found"
            })
        }
        return res.status(201).json({
            message: "main book schet successfully get",
            data
        });
    }

    static async updateMainBookSchet(req, res) {
        const { name, schet } = req.body;
        const id = req.params.id
        const old_data = await MainBookSchetDB.getByIdMainBookSchet([id])
        if (!old_data) {
            return res.status(404).json({
                message: "main book schet not found"
            })
        }
        const result = await MainBookSchetDB.updateMainBookSchet([
            name,
            schet,
            tashkentTime(),
            id
        ])
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deleteMainBookSchet(req, res) {
        const id = req.params.id
        const main_book_schet = await MainBookSchetDB.getByIdMainBookSchet([id])
        if (!main_book_schet) {
            return res.status(404).json({
                message: "main book schet not found"
            })
        }
        await MainBookSchetDB.deleteMainBookSchet([id])
        return res.status(200).json({
            message: 'delete main book schet successfully'
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
        for (let schet of data) {
            await MainBookSchetDB.createMainBookSchet([
                schet.name ? String(schet.name).trim() : '',
                schet.schet ? String(schet.schet).trim() : '',
                tashkentTime(),
                tashkentTime()
            ]);
        }
        return res.status(200).json({
            message: "import data successfully"
        })
    }
}