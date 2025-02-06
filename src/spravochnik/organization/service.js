const { OrganizationDB } = require('./db');
const xlsx = require('xlsx');
const { tashkentTime } = require('../../helper/functions');
const { db } = require('../../db/index');
const { BankService } = require('../bank/service');
const path = require('path');
const fs = require('fs').promises;

exports.OrganizationService = class {
    static async templateFile() {
        const fileName = `organization.template.xlsx`;
        const folderPath = path.join(__dirname, `../../../public/template`);

        const filePath = path.join(folderPath, fileName);

        const fileRes = await fs.readFile(filePath);

        return { fileName, fileRes };
    }

    static async getByInn(data) {
        const result = await OrganizationDB.getByInn([data.region_id, data.inn]);

        return result;
    }

    static async getByName(data) {
        const result = await OrganizationDB.getByName([data.region_id, data.name]);

        return result;
    }

    static async create(data) {
        const result = await OrganizationDB.create([
            data.name, data.bank_klient, data.raschet_schet,
            data.raschet_schet_gazna, data.mfo, data.inn, data.user_id,
            data.okonx, data.parent_id, tashkentTime(), tashkentTime()
        ]);

        return result;
    }

    static async get(data) {
        const result = await OrganizationDB.get(
            [data.region_id, data.offset, data.limit], data.search, data.organ_id
        );

        return result;
    }

    static async update(data) {
        const result = await OrganizationDB.update([
            data.name, data.bank_klient, data.raschet_schet,
            data.raschet_schet_gazna, data.mfo, data.inn, data.okonx,
            data.parent_id, data.id
        ]);

        return result;
    }

    static async delete(data) {
        const result = await OrganizationDB.delete([data.id]);

        return result;
    }

    static async getById(data) {
        const result = await OrganizationDB.getById([data.region_id, data.id], data.isdeleted);

        return result;
    }

    static async import(data) {
        await db.transaction(async client => {
            for (let item of data.data) {
                if (item.bank_klient && item.mfo) {
                    const bank = await BankService.getByMfoName({ bank_name: item.bank_klient, mfo: item.mfo });
                    if (!bank) {
                        await BankService.create({ bank_name: item.bank_klient, mfo: item.mfo });
                    }
                }

                await this.create({ ...item, user_id: data.user_id }, client);
            }
        })
    }

    static async readFile(data) {
        const workbook = xlsx.readFile(data.filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excel_data = xlsx.utils.sheet_to_json(sheet).map((row, index) => {
            const newRow = {};
            for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });

        const result = excel_data.filter((item, index) => index >= 2);

        return result;
    }
}


