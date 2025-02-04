const { MainSchetDB } = require('../spravochnik/main.schet/db');
const { OrganizationMonitoringDB } = require('./db');
const { OrganizationDB } = require('../spravochnik/organization/db');
const { RegionDB } = require('../auth/region/db')
const { ContractDB } = require('../shartnoma/db')
const { PodpisDB } = require('../spravochnik/podpis/db')
const { returnStringDate, returnStringSumma, returnExcelColumn, formatSubSchet } = require('../helper/functions')
const ExcelJS = require('exceljs')
const path = require('path')
const fs = require('fs').promises;

exports.OrganizationmonitoringService = class {
    static async monitoring(data, organ_id) {
        const docs = await OrganizationMonitoringDB.monitoring([
            data.region_id,
            data.main_schet_id,
            data.operatsii,
            data.from,
            data.to,
            data.offset,
            data.limit
        ], organ_id);

        const summa_from = await OrganizationMonitoringDB.getSumma([
            data.region_id,
            data.main_schet_id,
            data.operatsii,
            data.from
        ], '<', organ_id);

        const summa_to = await OrganizationMonitoringDB.getSumma([
            data.region_id,
            data.main_schet_id,
            data.operatsii,
            data.to
        ], '<=', organ_id);

        const total = await OrganizationMonitoringDB.getTotal([
            data.region_id,
            data.main_schet_id,
            data.operatsii,
            data.from,
            data.to
        ], organ_id)

        let summa_prixod = 0;
        let summa_rasxod = 0;
        for (let item of docs) {
            summa_prixod += item.summa_prixod
            summa_rasxod += item.summa_rasxod
        }
        
        return {
            data: docs,
            summa_from,
            summa_to,
            summa_prixod,
            summa_rasxod,
            total
        }
    }

    static async prixodRasxod(data, organizations) {
        let itogo_rasxod = 0;
        let itogo_prixod = 0;
        for (let item of organizations) {
            item.summa = await OrganizationMonitoringDB.getPrixodRasxod([
                data.operatsii,
                data.to,
                item.id,
                data.budjet_id
            ])
            itogo_rasxod += item.summa.rasxod_sum;
            itogo_prixod += item.prixod_sum;
        }
        return { organizations, itogo_rasxod, itogo_prixod };
    }

    static async cap(data) {
        let itogo_rasxod = 0;
        const result = await OrganizationMonitoringDB.cap([
            data.region_id,
            data.main_schet_id,
            data.operatsii,
            data.from,
            data.to
        ]);
        const uniqueSchets = Array.from(
            new Set(result.map(item => item.schet))
        ).map(schet => ({ schet }));

        for (let schet of uniqueSchets) {
            schet.summa = 0;
            for (let doc of result) {
                if (schet.schet === doc.schet) {
                    schet.summa += doc.summa;
                }
            }
            // Corrected filter
            schet.docs = result.filter(item => item.schet === schet.schet);
        }

        for (let item of result) {
            itogo_rasxod += item.summa;
        }
        return { data: uniqueSchets, itogo_rasxod };
    }

    static async prixodRasxodExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `organization_prixod_rasxod_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('organization prixod rasxod');
        worksheet.pageSetup.margins.left = 0
        worksheet.pageSetup.margins.header = 0
        worksheet.pageSetup.margins.footer = 0
        worksheet.pageSetup.margins.right = 0
        worksheet.mergeCells(`A1`, 'D1');
        const title = worksheet.getCell(`A1`);

        title.value = `${data.organ_name} ${returnStringDate(new Date(data.to))} холатига  ${data.operatsii} счет бўйича дебитор-кредитор  карздорлик тугрисида маълумот `
        const organ_nameCell = worksheet.getCell(`A2`)
        organ_nameCell.value = 'Наименование организации';
        const prixodCell = worksheet.getCell(`B2`)
        prixodCell.value = `Дебит`;
        const rasxodCell = worksheet.getCell(`C2`)
        rasxodCell.value = 'Кредит';
        const css_array = [title, organ_nameCell, prixodCell, rasxodCell];
        let itogo_rasxod = 0;
        let itogo_prixod = 0;
        let row_number = 3
        for (let column of data.organizations) {
            if (column.summa.summa === 0) {
                continue
            }
            const organ_nameCell = worksheet.getCell(`A${row_number}`)
            organ_nameCell.value = column.name
            const prixodCell = worksheet.getCell(`B${row_number}`)
            prixodCell.value = column.summa.summa > 0 ? column.summa.summa : 0
            itogo_prixod += prixodCell.value
            const rasxodCell = worksheet.getCell(`C${row_number}`)
            rasxodCell.value = column.summa.summa < 0 ? Math.abs(column.summa.summa) : 0
            itogo_rasxod += rasxodCell.value
            const css_array = [organ_nameCell, prixodCell, rasxodCell]
            css_array.forEach((item, index) => {
                let horizontal = 'center'
                let size = 10;
                if (index === 0) horizontal = 'left';
                if (index === 1 || index === 2) horizontal = 'right';
                Object.assign(item, {
                    numFmt: '#,##0.00',
                    font: { size, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                    alignment: { vertical: 'middle', horizontal, wrapText: true },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            })
            row_number++
        }
        const itogoStr = worksheet.getCell(`A${row_number}`)
        itogoStr.value = 'Итого'
        const prixod_itogoCell = worksheet.getCell(`B${row_number}`)
        prixod_itogoCell.value = itogo_prixod
        const rasxod_itogoCell = worksheet.getCell(`C${row_number}`)
        rasxod_itogoCell.value = itogo_rasxod
        css_array.push(itogoStr, prixod_itogoCell, rasxod_itogoCell)

        css_array.forEach((item, index) => {
            let fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
            let border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
            let horizontal = 'center'
            let size = 10;
            if (index === 0) fill = null, border = null, size = 12;
            if (index === 1) fill = null, border = { bottom: { style: 'thin' } }, size = 12;
            if (index === 4) fill = null, border = null, horizontal = 'right';
            if (index > 4) horizontal = 'right';
            Object.assign(item, {
                numFmt: '#,##0.00',
                font: { size, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal, wrapText: true },
                fill,
                border
            });
        })
        worksheet.getColumn(1).width = 40;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(3).width = 20;
        worksheet.getRow(1).height = 30;
        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }

    static async capExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `cap_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('organization prixod rasxod');
        worksheet.mergeCells(`A1`, 'F1');
        worksheet.getCell('A1').value = 'Журнал-ордер N_3';
        worksheet.mergeCells(`A2`, 'F2');
        worksheet.getCell('A2').value = `(${data.budjet_name} буджети)`;
        worksheet.mergeCells(`A3`, 'F3');
        worksheet.getCell('A3').value = `${returnStringDate(new Date(data.from))} дан   ${returnStringDate(new Date(data.to))} гача   ${data.operatsii}`;
        worksheet.mergeCells(`A4`, 'F4');
        worksheet.getCell('A4').value = `Подлежит записи в главную книгу`;
        worksheet.getCell('A5').value = 'счет';
        worksheet.getCell('B5').value = 'Тип расхода';
        worksheet.getCell('C5').value = 'Объект';
        worksheet.getCell('D5').value = 'Подобъект';
        worksheet.getCell('E5').value = 'Кредит';
        worksheet.getCell('F5').value = 'Сумма';
        worksheet.getCell('E6').value = data.operatsii;
        let row_number = !data.organizations.length ? 7 : 6;
        for (let schet of data.organizations) {
            for (let doc of schet.docs) {
                const sub_schet = formatSubSchet(doc.sub_schet);
                worksheet.getCell(`A${row_number}`).value = doc.schet;
                worksheet.getCell(`B${row_number}`).value = sub_schet[0];
                worksheet.getCell(`C${row_number}`).value = sub_schet[1];
                worksheet.getCell(`D${row_number}`).value = sub_schet[2];
                worksheet.getCell(`F${row_number}`).value = doc.summa;
                row_number++
            }
            worksheet.mergeCells(`A${row_number}`, `E${row_number}`);
            worksheet.getCell(`A${row_number}`).value = `Итого ${schet.schet}`;
            worksheet.getCell(`F${row_number}`).value = schet.summa;
            row_number++;
        }
        worksheet.mergeCells(`A${row_number}`, `E${row_number}`);
        worksheet.getCell(`A${row_number}`).value = 'Всего кредита';
        worksheet.getCell(`F${row_number}`).value = data.itogo_rasxod;
        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 15;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 15;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 20;
        worksheet.getRow(1).height = 30;
        worksheet.eachRow((row, rowNumber) => {
            worksheet.getRow(rowNumber).height = 20;
            row.eachCell((cell, columnNumber) => {
                let bold = false;
                let horizontal = "left";
                if (rowNumber < 6) {
                    bold = true;
                    horizontal = 'center'
                }
                if(rowNumber > 5 && columnNumber === 6){
                    horizontal = 'right'
                }
                if(rowNumber > 5 && columnNumber !== 1 && columnNumber !== 6){
                    horizontal = 'center'
                }
                Object.assign(cell, {
                    numFmt: '#,##0.00',
                    font: { size: 13, name: 'Times New Roman', bold },
                    alignment: { vertical: "middle", horizontal, wrapText: true },
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
        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }

    static async consolidated(data) {
        for (let organ of data.organizations) {
            const contract_id = data.contract ? organ.contract_id : null;
            organ.summa_from = await OrganizationMonitoringDB.getSummaConsolidated([
                data.region_id,
                data.main_schet_id,
                data.operatsii,
                data.from,
                organ.id
            ], '<', contract_id);
            organ.summa_bank_rasxod_prixod = await OrganizationMonitoringDB.getSummaPrixodConsolidated([
                data.region_id,
                data.main_schet_id,
                data.operatsii,
                data.from,
                data.to,
                organ.id
            ], contract_id)
            organ.summa_akt_rasxod = await OrganizationMonitoringDB.getSummaAktConsolidated([
                data.region_id,
                data.main_schet_id,
                data.operatsii,
                data.from,
                data.to,
                organ.id
            ], contract_id)
            organ.summa_jur7_rasxod = await OrganizationMonitoringDB.getSummaJur7Consolidated([
                data.region_id,
                data.main_schet_id,
                data.operatsii,
                data.from,
                data.to,
                organ.id
            ], contract_id)
            organ.summa_bank_prixod_rasxod = await OrganizationMonitoringDB.getSummaBankPrixodConsolidated([
                data.region_id,
                data.main_schet_id,
                data.operatsii,
                data.from,
                data.to,
                organ.id
            ], contract_id)
            let itogo_rasxod = 0;
            organ.summa_akt_rasxod.forEach(item => {
                itogo_rasxod += item.summa;
            })
            organ.summa_jur7_rasxod.forEach(item => {
                itogo_rasxod += item.summa;
            })
            organ.summa_bank_prixod_rasxod.forEach(item => {
                itogo_rasxod += item.summa;
            })
            organ.itogo_rasxod = {
                schet: "itogo_kredit",
                summa: itogo_rasxod
            };
            organ.summa_to = await OrganizationMonitoringDB.getSummaConsolidated([
                data.region_id,
                data.main_schet_id,
                data.operatsii,
                data.to,
                organ.id
            ], '<=', contract_id);
            data.rasxodSchets = await OrganizationMonitoringDB.getRasxodSchets([
                data.region_id,
                data.main_schet_id,
                data.operatsii,
                data.from,
                data.to
            ], contract_id)
            data.rasxodSchets.push({ schet: 'itogo_rasxod' })
        }
        return { organizations: data.organizations, rasxodSchets: data.rasxodSchets };
    }

    static async consolidatedExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `consolidated_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('consolelidated');
        worksheet.mergeCells(`A1`, 'C1');
        worksheet.getCell('A1').value = 'Журнал-ордер N_3';
        worksheet.mergeCells(`A2`, 'C2');
        worksheet.getCell('A2').value = `"Расчеты с дебеторами и кредиторами"`;
        worksheet.mergeCells(`A3`, 'C3');
        worksheet.getCell('A3').value = `${returnStringDate(new Date(data.to))} холатига  ${data.operatsii}`;
        worksheet.mergeCells(`A4`, 'A5');
        worksheet.mergeCells(`B4`, 'C4');
        worksheet.getCell('B4').value = `Остаток к начало`;
        worksheet.getCell('D4').value = 'Дебет';
        const endRasxodSchetsColumn = data.rasxodSchets.length + 4
        worksheet.mergeCells(`E4`, `${returnExcelColumn([endRasxodSchetsColumn])}4`);
        worksheet.getCell('E4').value = 'Кредит счета';
        worksheet.mergeCells(`${returnExcelColumn([endRasxodSchetsColumn + 1])}4`, `${returnExcelColumn([endRasxodSchetsColumn + 2])}4`);
        worksheet.getCell(`${returnExcelColumn([endRasxodSchetsColumn + 1])}4`).value = 'Остаток к конец';
        worksheet.getRow(5).values = [
            'Организатсия',
            'Дебет',
            'Кредит',
            '',
            ...data.rasxodSchets.map(item => {
                if (item.schet === 'itogo_rasxod') {
                    return 'итого кредит'
                } else {
                    return item.schet
                }
            }),
            'Дебет',
            'Кредит'
        ];
        worksheet.columns = [
            { key: 'name' },
            { key: 'prixod_from' },
            { key: 'rasxod_from' },
            { key: `_prixod_${data.operatsii}` },
            ...data.rasxodSchets.map(item => {
                return { key: `_rasxod_${item.schet}` }
            }),
            { key: 'prixod_to' },
            { key: 'rasxod_to' }
        ];
        for (let organ of data.organizations) {
            if (organ.summa_from.summa === 0 && organ.summa_to.summa === 0) {
                continue;
            }
            const values = data.rasxodSchets.reduce((acc, item) => {
                const schetKey = `_rasxod_${item.schet}`;
                const matchAkt = organ.summa_akt_rasxod.find(i => i.schet === item.schet);
                const matchBankPrixod = organ.summa_bank_prixod_rasxod.find(i => i.schet === item.schet);
                const matchJur7 = organ.summa_jur7_rasxod.find(i => i.schet === item.schet);
                if (!matchAkt && !matchBankPrixod && !matchJur7 && item.schet !== 'itogo_rasxod') {
                    acc.push({ schet: schetKey, summa: '' });
                }
                if (matchAkt) acc.push({ schet: schetKey, summa: matchAkt.summa });
                if (matchBankPrixod) acc.push({ schet: schetKey, summa: matchBankPrixod.summa });
                if (matchJur7) acc.push({ schet: schetKey, summa: matchJur7.summa });
                if (item.schet === 'itogo_rasxod') {
                    acc.push({
                        schet: schetKey,
                        summa: organ.itogo_rasxod.summa
                    });
                }
                return acc;
            }, []);
            worksheet.addRow({
                name: organ.name,
                prixod_from: Math.max(organ.summa_from.summa, 0),
                rasxod_from: Math.max(-organ.summa_from.summa, 0),
                [`_prixod_${data.operatsii}`]: organ.summa_bank_rasxod_prixod[0]?.summa || '',
                ...values.reduce((acc, { schet, summa }) => {
                    acc[schet] = summa;
                    return acc;
                }, {}),
                prixod_to: Math.max(organ.summa_to.summa, 0),
                rasxod_to: Math.max(-organ.summa_to.summa, 0)
            });
        }
        worksheet.eachRow((row, rowNumber) => {
            let bold = false;
            if (rowNumber < 6) {
                worksheet.getRow(rowNumber).height = 30;
                bold = true;
            }
            row.eachCell((cell, columnNumber) => {
                if (columnNumber === 1) {
                    worksheet.getColumn(columnNumber).width = 40;
                } else {
                    worksheet.getColumn(columnNumber).width = 18;
                }
                Object.assign(cell, {
                    numFmt: "#0.00",
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
        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return { filePath, fileName };
    }

    static async consolidatedByContractExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `consolidated_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('consolelidated');
        worksheet.mergeCells(`A1`, 'C1');
        worksheet.getCell('A1').value = 'Журнал-ордер N_3';
        worksheet.mergeCells(`A2`, 'C2');
        worksheet.getCell('A2').value = `"Расчеты с дебеторами и кредиторами"`;
        worksheet.mergeCells(`A3`, 'C3');
        worksheet.getCell('A3').value = `${returnStringDate(new Date(data.to))} холатига  ${data.operatsii}`;
        worksheet.mergeCells(`A4`, 'A5');
        worksheet.mergeCells(`B4`, 'C4');
        worksheet.getCell('B4').value = `Остаток к начало`;
        worksheet.mergeCells(`D4`, 'E4');
        worksheet.getCell('D4').value = 'Договор ';
        worksheet.getCell('F4').value = 'Дебет';
        const endRasxodSchetsColumn = data.rasxodSchets.length + 6
        worksheet.mergeCells(`G4`, `${returnExcelColumn([endRasxodSchetsColumn])}4`);
        worksheet.getCell('G4').value = 'Кредит счета';
        worksheet.mergeCells(`${returnExcelColumn([endRasxodSchetsColumn + 1])}4`, `${returnExcelColumn([endRasxodSchetsColumn + 2])}4`);
        worksheet.getCell(`${returnExcelColumn([endRasxodSchetsColumn + 1])}4`).value = 'Остаток к конец';
        worksheet.getRow(5).values = [
            'Организатсия',
            'Номер',
            'Дата',
            'Дебет',
            'Кредит',
            data.operatsii,
            ...data.rasxodSchets.map(item => {
                if (item.schet === 'itogo_rasxod') {
                    return 'итого кредит'
                } else {
                    return item.schet
                }
            }),
            'Дебет',
            'Кредит'
        ];
        worksheet.columns = [
            { key: 'name' },
            { key: 'contract_number' },
            { key: 'contract_date' },
            { key: 'prixod_from' },
            { key: 'rasxod_from' },
            { key: `_prixod_${data.operatsii}` },
            ...data.rasxodSchets.map(item => {
                return { key: `_rasxod_${item.schet}` }
            }),
            { key: 'prixod_to' },
            { key: 'rasxod_to' }
        ];
        for (let organ of data.organizations) {
            if (organ.summa_from.summa === 0 && organ.summa_to.summa === 0) {
                continue;
            }
            const values = data.rasxodSchets.reduce((acc, item) => {
                const schetKey = `_rasxod_${item.schet}`;
                const matchAkt = organ.summa_akt_rasxod.find(i => i.schet === item.schet);
                const matchBankPrixod = organ.summa_bank_prixod_rasxod.find(i => i.schet === item.schet);
                const matchJur7 = organ.summa_jur7_rasxod.find(i => i.schet === item.schet);
                if (!matchAkt && !matchBankPrixod && !matchJur7 && item.schet !== 'itogo_rasxod') {
                    acc.push({ schet: schetKey, summa: '' });
                }
                if (matchAkt) acc.push({ schet: schetKey, summa: matchAkt.summa });
                if (matchBankPrixod) acc.push({ schet: schetKey, summa: matchBankPrixod.summa });
                if (matchJur7) acc.push({ schet: schetKey, summa: matchJur7.summa });
                if (item.schet === 'itogo_rasxod') {
                    acc.push({
                        schet: schetKey,
                        summa: organ.itogo_rasxod.summa
                    });
                }
                return acc;
            }, []);
            worksheet.addRow({
                name: organ.name,
                contract_number: organ.doc_num,
                contract_date: organ.doc_date,
                prixod_from: Math.max(organ.summa_from.summa, 0),
                rasxod_from: Math.max(-organ.summa_from.summa, 0),
                [`_prixod_${data.operatsii}`]: organ.summa_bank_rasxod_prixod[0]?.summa || '',
                ...values.reduce((acc, { schet, summa }) => {
                    acc[schet] = summa;
                    return acc;
                }, {}),
                prixod_to: Math.max(organ.summa_to.summa, 0),
                rasxod_to: Math.max(-organ.summa_to.summa, 0)
            });
        }
        worksheet.eachRow((row, rowNumber) => {
            let bold = false;
            if (rowNumber < 6) {
                worksheet.getRow(rowNumber).height = 30;
                bold = true;
            }
            row.eachCell((cell, columnNumber) => {
                if (columnNumber === 1) {
                    worksheet.getColumn(columnNumber).width = 40;
                } else {
                    worksheet.getColumn(columnNumber).width = 18;
                }
                Object.assign(cell, {
                    numFmt: "#0.00",
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
        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return { filePath, fileName };
    }




    static async aktSverka(req, res) {
        const region_id = req.user.region_id;
        const { main_schet_id, contract_id, organ_id, to, from } = req.query;
        const region = await RegionDB.getByIdRegion([region_id])
        if (!region) {
            return res.status(404).json({
                message: "region not found"
            })
        }
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const organization = await OrganizationDB.getById([region_id, organ_id])
        if (!organization) {
            return res.status(404).json({
                message: "organization not found"
            })
        }
        if (contract_id) {
            const contract = await ContractDB.getById([region_id, contract_id], true, main_schet.spravochnik_budjet_name_id, organ_id);
            if (!contract) {
                return res.status(404).json({
                    message: "contract not found"
                })
            }
        }
        const data = await OrganizationMonitoringDB.getByContractIdData([from, to, organ_id], contract_id);
        const summa_from = await OrganizationMonitoringDB.getByContractIdSumma([from, organ_id], '<', contract_id)
        const summa_to = await OrganizationMonitoringDB.getByContractIdSumma([to, organ_id], '<=', contract_id)
        const podpis = await PodpisDB.getPodpis([region_id], 'akkt_sverka');
        let summa_rasxod = 0;
        let summa_prixod = 0;
        for (let item of data) {
            summa_rasxod += item.summa_rasxod
            summa_prixod += item.summa_prixod
        }
        const head = `Акт сверки взаимарасчетов`;
        const title = `Мы, нижеподписавшиеся Начальник ${main_schet.tashkilot_nomi} " OOO ${organization.name}" АЖ произвели сверку взаимных расчетов между ${main_schet.tashkilot_nomi} "${organization.name}" АЖ по состоянию на ${returnStringDate(new Date(to))}`;
        const workbook = new ExcelJS.Workbook();
        const fileName = `akt_sverki_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('Акт сверки');
        worksheet.pageSetup.margins.left = 0;
        worksheet.pageSetup.margins.header = 0;
        worksheet.pageSetup.margins.footer = 0;
        worksheet.mergeCells('A1', 'K1');
        const headCell = worksheet.getCell('A1');
        Object.assign(headCell, {
            value: head,
            font: { size: 14, bold: true, color: { argb: 'FF004080' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'center' }
        });
        worksheet.mergeCells('A2', 'K2');
        worksheet.mergeCells('A3', 'C3');
        worksheet.mergeCells('D3', 'G3');
        worksheet.mergeCells('H3', 'K3');
        const titleCell = worksheet.getCell('A2');
        titleCell.value = title;
        const row1Cell = worksheet.getCell('A3');
        row1Cell.value = `Содержание записей`
        const row2Cell = worksheet.getCell('D3');
        row2Cell.value = main_schet.tashkilot_nomi;
        const row3Cell = worksheet.getCell('H3');
        row3Cell.value = `${organization.name}`
        worksheet.mergeCells('A4', 'C4');
        const empty = worksheet.getCell('A4');
        empty.value = '';
        worksheet.mergeCells('D4', 'E4');
        const debit1 = worksheet.getCell('D4');
        debit1.value = `Дебит`;
        worksheet.mergeCells('F4', 'G4');
        const kridit1 = worksheet.getCell('F4')
        kridit1.value = 'Кредит';
        worksheet.mergeCells('H4', 'I4');
        const debit2 = worksheet.getCell('H4');
        debit2.value = `Дебит`;
        worksheet.mergeCells('J4', 'K4');
        const kridit2 = worksheet.getCell('J4')
        kridit2.value = 'Кредит';
        worksheet.mergeCells('A5', 'C5');
        const empty2 = worksheet.getCell('A5');
        empty2.value = 'Остаток к началу дня:'
        worksheet.mergeCells('D5', 'E5');
        const debit1_2 = worksheet.getCell('D5');
        debit1_2.value = summa_from > 0 ? summa_from : 0
        worksheet.mergeCells('F5', 'G5');
        const kridit1_2 = worksheet.getCell('F5')
        kridit1_2.value = summa_from < 0 ? Math.abs(summa_from) : 0
        worksheet.mergeCells('H5', 'I5');
        const debit2_2 = worksheet.getCell('H5');
        debit2_2.value = summa_from < 0 ? Math.abs(summa_from) : 0
        worksheet.mergeCells('J5', 'K5');
        const kridit2_2 = worksheet.getCell('J5')
        kridit2_2.value = summa_from > 0 ? summa_from : 0
        for (let item of data) {
            const row_number = worksheet.lastRow.number + 1
            worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
            const text = `${item.opisanie || 'Описание'}`;
            const row1 = worksheet.getCell(`A${row_number}`);
            Object.assign(row1, {
                value: text,
                font: { size: 10, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
            const rowHeight = Math.ceil(text.length / 30) * 15;
            const row = worksheet.getRow(row_number);
            row.height = rowHeight;
            worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
            const debit1 = worksheet.getCell(`D${row_number}`);
            debit1.value = item.summa_prixod
            worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
            const kridit1 = worksheet.getCell(`F${row_number}`)
            kridit1.value = item.summa_rasxod
            worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
            const debit2 = worksheet.getCell(`H${row_number}`);
            debit2.value = item.summa_rasxod
            worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
            const kridit2 = worksheet.getCell(`J${row_number}`)
            kridit2.value = item.summa_prixod
            const summa_array = [debit1, debit2, kridit1, kridit2]
            summa_array.forEach(item => {
                Object.assign(item, {
                    numFmt: '#,##0.00',
                    font: { size: 10, name: 'Times New Roman' },
                    alignment: { vertical: 'middle', horizontal: 'right' },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            })
        };
        let row_number = worksheet.lastRow.number + 1
        worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
        const empty3 = worksheet.getCell(`A${row_number}`);
        empty3.value = `Итого`
        worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
        const debit3 = worksheet.getCell(`D${row_number}`);
        debit3.value = summa_prixod
        worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
        const kridit3 = worksheet.getCell(`F${row_number}`)
        kridit3.value = summa_rasxod
        worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
        const debit3_2 = worksheet.getCell(`H${row_number}`);
        debit3_2.value = summa_rasxod
        worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
        const kridit3_2 = worksheet.getCell(`J${row_number}`)
        kridit3_2.value = summa_prixod
        row_number = row_number + 1

        worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
        const empty4 = worksheet.getCell(`A${row_number}`);
        empty4.value = `Остаток концу дня:`
        worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
        const debit4 = worksheet.getCell(`D${row_number}`);
        debit4.value = summa_to > 0 ? summa_to : 0
        worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
        const kridit4 = worksheet.getCell(`F${row_number}`)
        kridit4.value = summa_to < 0 ? Math.abs(summa_to) : 0
        worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
        const debit4_2 = worksheet.getCell(`H${row_number}`);
        debit4_2.value = summa_to < 0 ? Math.abs(summa_to) : 0
        worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
        const kridit4_2 = worksheet.getCell(`J${row_number}`)
        kridit4_2.value = summa_to > 0 ? summa_to : 0
        row_number = row_number + 1

        worksheet.mergeCells(`A${row_number}`, `K${row_number}`);
        const footer = worksheet.getCell(`A${row_number}`)
        footer.value = `Сальдо в пользу : ${podpis[0]?.fio_name || 'podis'} ${returnStringSumma(summa_to)}`
        worksheet.getRow(row_number).height = 40
        row_number = row_number + 1

        worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
        const podotchet = worksheet.getCell(`A${row_number}`)
        podotchet.value = `Началник ${main_schet.tashkilot_nomi} ${podpis[0]?.fio_name || 'podis'}`
        worksheet.mergeCells(`G${row_number}`, `K${row_number}`);
        const organ = worksheet.getCell(`G${row_number}`)
        organ.value = `Руководитель "${organization.name}" АЖ`
        worksheet.getRow(row_number).height = 30
        row_number = row_number + 1

        worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
        const imzo1 = worksheet.getCell(`A${row_number}`)
        imzo1.value = ``
        imzo1.border = { bottom: { style: 'thin' } }
        worksheet.mergeCells(`G${row_number}`, `K${row_number}`);
        const imzo2 = worksheet.getCell(`G${row_number}`)
        imzo2.value = ``
        imzo2.border = { bottom: { style: 'thin' } }
        worksheet.getRow(row_number).height = 30
        const array_headers = [
            footer,
            podotchet,
            organ,
            imzo1,
            imzo2,
            titleCell,
            row1Cell,
            row2Cell,
            row3Cell,
            empty,
            debit1,
            debit2,
            kridit1,
            kridit2,
            empty2,
            debit1_2,
            debit2_2,
            kridit1_2,
            kridit2_2,
            empty3,
            debit3,
            debit3_2,
            kridit3,
            kridit3_2,
            empty4,
            debit4,
            debit4_2,
            kridit4,
            kridit4_2
        ]
        array_headers.forEach((item, index) => {
            let argb = 'FF004080'
            let horizontal = `center`
            if (index > 13) {
                argb = '000000'
                horizontal = 'right'
            }
            Object.assign(item, {
                numFmt: `#,##0.00`,
                font: { size: 10, bold: true, color: { argb }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal, wrapText: true }
            });
            if (item.value !== '' && index > 5) {
                Object.assign(item, {
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                })
            }
        })
        const titleLength = title.length;
        worksheet.getRow(2).height = titleLength > 150 ? 60 : titleLength > 100 ? 50 : 40;
        worksheet.getRow(1).height = 25;
        worksheet.getRow(3).height = 35;
        worksheet.getRow(4).height = 25;
        worksheet.getColumn(4).width = 8;
        worksheet.getColumn(5).width = 8;
        worksheet.getColumn(6).width = 8;
        worksheet.getColumn(7).width = 8;
        worksheet.getColumn(8).width = 8;
        worksheet.getColumn(9).width = 8;
        worksheet.getColumn(10).width = 8;
        worksheet.getColumn(11).width = 8;
        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    }
}
