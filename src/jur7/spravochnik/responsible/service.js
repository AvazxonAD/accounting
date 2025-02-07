const { ResponsibleDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');
const path = require('path');
const fs = require('fs').promises;
const xlsx = require('xlsx');
const { db } = require('../../../db/index');

exports.ResponsibleService = class {
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

    static async templateFile() {
        const fileName = `responsible.xlsx`;
        const folderPath = path.join(__dirname, `../../../../public/template`);

        const filePath = path.join(folderPath, fileName);

        const fileRes = await fs.readFile(filePath);

        return { fileName, fileRes };
    }

    static async getById(data) {
        const result = await ResponsibleDB.getById([data.region_id, data.id], data.isdeleted);
        return result;
    }

    static async getByFio(data) {
        const result = await ResponsibleDB.getByFio([data.region_id, data.fio]);

        return result;
    }

    static async getResponsible(data) {
        const result = await ResponsibleDB.getResponsible([data.region_id, data.offset, data.limit]);
        return result;
    }

    static async createResponsible(data) {
        const result = await ResponsibleDB.createResponsible([
            data.podraz_id,
            data.fio,
            data.user_id,
            tashkentTime(),
            tashkentTime()
        ], data.client);

        return result;
    }

    static async import(data) {
        for (let item of data.responsibles) {
            await db.transaction(async client => {
                await this.createResponsible({
                    client,
                    podraz_id: item.spravochnik_podrazdelenie_jur7_id,
                    user_id: data.user_id,
                    fio: item.fio
                })
            })
        }
    }
}