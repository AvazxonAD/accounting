const { GroupDB } = require('./db');
const { HelperFunctions } = require('../../../helper/functions');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs').promises;
const { db } = require('../../../db/index');

exports.GroupService = class {
    static async import(data) {
        await db.transaction(async client => {
            for (let item of data.groups) {
                await this.create({ ...item, client });
            }
        })
    }

    static async getById(data) {
        const result = await GroupDB.getById([data.id]);
        return result;
    }

    static async getByName(data) {
        const result = await GroupDB.getByName([data.name]);

        return result;
    }

    static async getByNumberName(data) {
        const result = await GroupDB.getByNumberName([data.number, data.name]);

        return result;
    }

    static async get(data) {
        const result = await GroupDB.get([data.offset, data.limit], data.search);

        return { data: result.data || [], total: result.total }
    }

    static async create(data) {
        const result = await GroupDB.create([
            data.smeta_id,
            data.name,
            data.schet,
            data.iznos_foiz,
            String(data.provodka_debet).replace(/\s/g, ''),
            data.group_number,
            String(data.provodka_kredit).replace(/\s/g, ''),
            String(data.provodka_subschet).replace(/\s/g, ''),
            data.roman_numeral,
            data.pod_group,
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime()
        ], data.client);

        return result;
    }

    static async update(data) {
        const result = await GroupDB.update([
            data.smeta_id,
            data.name,
            data.schet,
            data.iznos_foiz,
            data.provodka_debet,
            data.group_number,
            data.provodka_kredit,
            data.provodka_subschet,
            data.roman_numeral,
            data.pod_group,
            HelperFunctions.tashkentTime(),
            data.id
        ]);

        return result;
    }

    static async delete(data) {
        const result = await GroupDB.delete([data.id]);

        return result;
    }

    static async getWithPercent() {
        const result = await GroupDB.getWithPercent();

        return result;
    }

    static async readFile(data) {
        const workbook = xlsx.readFile(data.filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const excel_data = xlsx.utils.sheet_to_json(sheet).map(row => {
            const newRow = {};

            for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });

        const result = excel_data.filter((item, index) => index > 2);

        return result;
    }

    static async templateFile() {
        const fileName = `group.xlsx`;
        const folderPath = path.join(__dirname, `../../../../public/template`);

        const filePath = path.join(folderPath, fileName);

        const fileRes = await fs.readFile(filePath);

        return { fileName, fileRes };
    }
}