const { BankMfoDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const xlsx = require('xlsx')

exports.BankMfoService = class {
    static async createBankMfo(req, res) {
        const { mfo, bank_name } = req.body;
        const bankMfo = await BankMfoDB.getByNameBankMfo([mfo, bank_name])
        if (bankMfo) {
            return res.status(409).json({
                message: "This data already exists"
            });
        }
        const result = await BankMfoDB.createBankMfo([
            mfo,
            bank_name,
            tashkentTime(),
            tashkentTime()
        ]);
        return res.status(201).json({
            message: "Create bank mfo successfully",
            data: result
        });
    }

    static async getBankMfo(req, res) {
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await BankMfoDB.getBankMfo([offset, limit], search);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        };
        return res.status(200).json({
            message: "Bank mfo successfully retrieved",
            meta,
            data: data || []
        });
    }

    static async getByIdBankMfo(req, res) {
        const id = req.params.id;
        const data = await BankMfoDB.getByIdBankMfo([id], true);
        if (!data) {
            return res.status(404).json({
                message: "Bank mfo not found"
            });
        }
        return res.status(200).json({
            message: "Bank mfo successfully retrieved",
            data
        });
    }

    static async updateBankMfo(req, res) {
        const { mfo, bank_name } = req.body;
        const id = req.params.id;
        const oldBankMfo = await BankMfoDB.getByIdBankMfo([id]);
        if (!oldBankMfo) {
            return res.status(404).json({
                message: "Bank mfo not found"
            });
        }
        if (oldBankMfo.mfo !== mfo || oldBankMfo.bank_name !== bank_name) {
            const bankMfo = await BankMfoDB.getByNameBankMfo([mfo, bank_name]);
            if (bankMfo) {
                return res.status(409).json({
                    message: "This data already exists"
                });
            }
        }
        const result = await BankMfoDB.updateBankMfo([
            mfo,
            bank_name,
            tashkentTime(),
            id
        ]);
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deleteBankMfo(req, res) {
        const id = req.params.id;
        const bankMfo = await BankMfoDB.getByIdBankMfo([id]);
        if (!bankMfo) {
            return res.status(404).json({
                message: "Bank mfo not found"
            });
        }
        await BankMfoDB.deleteBankMfo([id]);
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
            await BankMfoDB.createBankMfo([
                String(bank.mfo).trim(),
                String(bank.bank_name).trim(),
                tashkentTime(),
                tashkentTime()
            ]);
        }
        return res.status(200).json({
            message: "'Created successfully!"
        })
    }
}