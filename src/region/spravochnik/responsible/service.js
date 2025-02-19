const { ResponsibleDB } = require('./db');
const { tashkentTime } = require('@helper/functions');
const path = require('path');
const fs = require('fs').promises;
const xlsx = require('xlsx');
const { db } = require('@db/index');
const ExcelJS = require('exceljs');

exports.ResponsibleService = class {
    static async export(data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('responsibles');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'FIO', key: 'fio', width: 25 },
            { header: 'Podraz ID', key: 'podraz_id', width: 30 },
            { header: 'Podrazdelenie', key: 'poraz_name', width: 20 }
        ];

        data.forEach((item) => {
            worksheet.addRow({
                id: item.id,
                fio: item.fio,
                podraz_id: item.spravochnik_podrazdelenie_jur7_id,
                poraz_name: item.spravochnik_podrazdelenie_jur7_name
            });
        });

        worksheet.eachRow((row, rowNumber) => {
            let bold = false;
            if (rowNumber === 1) {
                worksheet.getRow(rowNumber).height = 30;
                bold = true;
            }

            row.eachCell((cell) => {
                Object.assign(cell, {
                    font: { size: 13, name: 'Times New Roman', bold },
                    alignment: { vertical: "middle", horizontal: "center", wrapText: true },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            });
        });

        const folderPath = path.join(__dirname, `../../../../public/exports`);

        try {
            await fs.access(folderPath, fs.constants.W_OK)
        } catch (error) {
            await fs.mkdir(folderPath);
        }

        const fileName = `responsibles.${new Date().getTime()}.xlsx`;

        const filePath = `${folderPath}/${fileName}`;

        await workbook.xlsx.writeFile(filePath);

        return { fileName, filePath };
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

        const result = excel_data.filter((item, index) => index >= 3);

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
        const result = await ResponsibleDB.getResponsible([data.region_id, data.offset, data.limit], data.search, data.podraz_id);
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