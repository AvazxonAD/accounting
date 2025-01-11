const { Monitoringjur7DB } = require('./db')
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const ExcelJS = require('exceljs')
const { getMonthStartEnd, returnMonth } = require('../../helper/functions')
const { MainSchetDB } = require('../../spravochnik/main.schet/db')
const { RegionDB } = require('../../auth/region/db')
const path = require('path')
const fs = require('fs').promises
const { MainSchetService } = require('../../spravochnik/main.schet/services');
const { Jur7MonitoringService } = require('./service');

exports.Controller = class {
    static async obrotkaReport(req, res) {
        const { month, year, main_schet_id } = req.query;
        const region_id = req.user.region_id;
        const schets = await Monitoringjur7DB.getSchets([year, month, main_schet_id])
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const region = await RegionDB.getByIdRegion([region_id])
        if (!region) {
            return res.status(500).json({
                message: "Interval server error region not found"
            })
        }
        const dates = getMonthStartEnd(year, month);
        for (let schet of schets) {
            schet.summa_from = await Monitoringjur7DB.getSummaReport([main_schet_id, schet.schet, dates[0]], '<')
            schet.internal = await Monitoringjur7DB.getSummaReport([main_schet_id, schet.schet, dates[0], dates[1]])
            schet.summa_to = await Monitoringjur7DB.getSummaReport([main_schet_id, schet.schet, dates[1]], '<=')
        }

        const Workbook = new ExcelJS.Workbook();
        const worksheet = Workbook.addWorksheet('obrotka');

        worksheet.mergeCells('A1', 'C1')
        const titleCell = worksheet.getCell('A1')
        titleCell.value = `СВОДНАЯ ОБОРОТЬ ЗА ${returnMonth(month)} ${year} год.`;

        worksheet.mergeCells('D1', 'E1')
        const regionNameCell = worksheet.getCell('D1')
        regionNameCell.value = region.name;

        worksheet.getRow(2).values = ['СЧЕТ', 'САЛЬДО', 'ПРИХОД', 'РАСХОД', 'САЛЬДО'];

        worksheet.columns = [
            { key: 'schet', width: 20 },
            { key: 'from', width: 20 },
            { key: 'prixod', width: 20 },
            { key: 'rasxod', width: 20 },
            { key: 'to', width: 20 }
        ];

        for (let schet of schets) {
            worksheet.addRow(
                { schet: schet.schet, from: schet.summa_from.summa, prixod: schet.internal.prixod, rasxod: schet.internal.rasxod, to: schet.summa_to.summa }
            )
        }

        const folderPath = path.join(__dirname, '../../../public/exports/')
        try {
            await fs.access(folderPath)
        } catch (error) {
            try {
                await fs.mkdir(folderPath);
            } catch (error) {
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
        }

        worksheet.eachRow((row, rowNumber) => {
            let size = 12;
            let bold = false;
            let horizontal = 'center'
            if (rowNumber === 1) {
                size = 15;
                bold = true;
            }
            row.eachCell((cell, cellNumber) => {
                if (rowNumber > 2 && cellNumber > 1) {
                    horizontal = 'right'
                }
                if (rowNumber === 1) {
                    Object.assign(cell, {
                        font: { size, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                        alignment: { vertical: 'middle', horizontal }
                    });
                } else {
                    Object.assign(cell, {
                        font: { size, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                        alignment: { vertical: 'middle', horizontal },
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    });
                }
            })
        })
        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 18;
        const filePath = folderPath + '/' + `obrotka_${new Date().getTime()}.xlsx`
        await Workbook.xlsx.writeFile(filePath);
        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    }

    static async materialReport(req, res) {
        const { month, year, main_schet_id } = req.query;
        const region_id = req.user.region_id;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const dates = getMonthStartEnd(year, month);

        const Workbook = new ExcelJS.Workbook();
        const worksheet = Workbook.addWorksheet('material');

        worksheet.mergeCells('G1', 'K1')
        const title1 = worksheet.getCell('G1')
        title1.value = '"Тасдиқлайман"'

        worksheet.mergeCells('G2', 'K2')
        const title2 = worksheet.getCell('G2')
        title2.value = region.name

        worksheet.mergeCells('G3', 'K3')
        const title3 = worksheet.getCell('G3')
        title3.value = 'бошлиғи'

        worksheet.mergeCells('G4', 'K4')
        const title4 = worksheet.getCell('G4')
        title4.value = ''

        worksheet.mergeCells('A5', 'K5')
        const title5 = worksheet.getCell('A5')
        title5.value = `Материалный отчёт за ${returnMonth(month)} ${year} год.`;

        const productTitleCell = worksheet.getCell('A6')
        productTitleCell.value = 'Назвал предмет'

        const edinTitleCell = worksheet.getCell('B6')
        edinTitleCell.value = 'Ед.ном'

        worksheet.mergeCells('C6', 'D6')
        const fromCell = worksheet.getCell('C6')
        fromCell.value = 'ОСТАТОК на нач';

        worksheet.mergeCells('E6', 'H6')
        const oborotCell = worksheet.getCell('E6')
        oborotCell.value = 'ОБОРОТ';

        worksheet.mergeCells('I6', 'J6')
        const toCell = worksheet.getCell('I6')
        toCell.value = 'ОСТАТОК на кон'

        const date_prixod = worksheet.getCell('K6')
        date_prixod.value = 'Дата приход'

        worksheet.getRow(7).values = [
            '',
            '',
            'Кол',
            'Остаток',
            'Кол',
            'Приход',
            'Кол',
            'Расход',
            'Кол',
            'Остаток'
        ]

        worksheet.columns = [
            { key: 'product_name', width: 30 },
            { key: 'edin', width: 15 },
            { key: 'from_kol', width: 15 },
            { key: 'from_summa', width: 15 },
            { key: 'prixod_kol', width: 15 },
            { key: 'prixod', width: 15 },
            { key: 'rasxod_kol', width: 15 },
            { key: 'rasxod', width: 15 },
            { key: 'to_kol', width: 15 },
            { key: 'to_summa', width: 15 },
            { key: 'date', width: 15 }
        ];

        const responsibles = await ResponsibleDB.getResponsibleReport([region_id])
        for (let responsible of responsibles) {
            responsible.schets = await Monitoringjur7DB.getSchets([year, month, main_schet_id], responsible.id)
            for (let schet of responsible.schets) {
                schet.products = await Monitoringjur7DB.getBySchetProducts([region_id, main_schet_id, schet.schet, responsible.id])
                schet.kol_from = 0;
                schet.summa_from = 0;
                schet.kol_prixod = 0;
                schet.prixod = 0;
                schet.kol_rasxod = 0;
                schet.rasxod = 0;
                schet.kol_to = 0;
                schet.summa_to = 0;
                for (let product of schet.products) {
                    product.summa_from = await Monitoringjur7DB.getSummaReport([main_schet_id, schet.schet, dates[0]], '<', responsible.id, product.id)
                    product.internal = await Monitoringjur7DB.getSummaReport([main_schet_id, schet.schet, dates[0], dates[1]], null, responsible.id, product.id)
                    product.summa_to = await Monitoringjur7DB.getSummaReport([main_schet_id, schet.schet, dates[1]], '<=', responsible.id, product.id)
                    schet.kol_from += product.summa_from.kol
                    schet.summa_from += product.summa_from.summa;
                    schet.kol_prixod += product.internal.prixod_kol;
                    schet.prixod += product.internal.prixod;
                    schet.kol_rasxod += product.internal.rasxod_kol;
                    schet.rasxod += product.internal.rasxod;
                    schet.kol_to += product.summa_to.kol;
                    schet.summa_to += product.summa_to.summa;
                }
            }
        }

        for (let responsible of responsibles) {
            for (let schet of responsible.schets) {
                if (schet.products.length) {
                    worksheet.addRow({})
                    worksheet.addRow({ product_name: responsible.fio })
                    worksheet.addRow({ product_name: `Счет ${schet.schet}` })
                    for (let product of schet.products) {
                        worksheet.addRow(
                            {
                                product_name: product.name,
                                edin: product.edin,
                                from_kol: product.summa_from.kol,
                                from_summa: product.summa_from.summa,
                                prixod_kol: product.internal.prixod_kol,
                                prixod: product.internal.prixod,
                                rasxod_kol: product.internal.rasxod_kol,
                                rasxod: product.internal.rasxod,
                                to_kol: product.summa_to.kol,
                                to_summa: product.summa_to.summa,
                                date: product.doc_date
                            }
                        )
                    }
                    worksheet.addRow(
                        {
                            product_name: '',
                            edin: '',
                            from_kol: schet.kol_from,
                            from_summa: schet.summa_from,
                            prixod_kol: schet.kol_prixod,
                            prixod: schet.prixod,
                            rasxod_kol: schet.kol_rasxod,
                            rasxod: schet.rasxod,
                            to_kol: schet.kol_to,
                            to_summa: schet.summa_to,
                            date: undefined
                        }
                    )
                }
            }
        }
        worksheet.eachRow((row, rowNumber) => {
            let size = 12;
            let bold = false;
            let horizontal = 'center'
            let border = {
                top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
            };
            if (rowNumber < 6) {
                worksheet.getRow(rowNumber).height = 25;
                bold = true;
            }
            if (rowNumber === 3) {
                horizontal = 'left';
            }
            if (rowNumber === 4) {
                border = {
                    top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    bottom: { style: 'thin' },
                    right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
                };
            }
            row.eachCell((cell) => {
                if (rowNumber > 5 && cell.value !== '' && cell.value !== undefined) {
                    border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
                Object.assign(cell, {
                    font: { size, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                    alignment: { vertical: 'middle', horizontal },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border
                });
            })
        })
        const folderPath = path.join(__dirname, '../../../public/exports/')
        try {
            await fs.access(folderPath)
        } catch (error) {
            try {
                await fs.mkdir(folderPath);
            } catch (error) {
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
        }
        const filePath = folderPath + '/' + `material_${new Date().getTime()}.xlsx`
        await Workbook.xlsx.writeFile(filePath);
        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    }

    static async cap(req, res) {
        const region_id = req.user.region_id;
        const { main_schet_id, from, to, excel } = req.query;
        const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });

        if (!main_schet) {
            return res.error('Main schet not found', 404);
        }

        const data = await Jur7MonitoringService.cap({ region_id, main_schet_id, from, to });

        if (excel === 'true') {
            const { fileName, filePath } = await Jur7MonitoringService.capExcel({ ...data, from, to });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            return res.download(filePath);
        }
        return res.success('Get successfully', 200, null, data);
    }
}