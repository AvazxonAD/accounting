const { PodotchetDB } = require('../spravochnik/podotchet/db');
const { MainSchetDB } = require('../spravochnik/main.schet/db');
const { BankRasxodDB } = require('../bank/rasxod/db');
const { BankPrixodDB } = require('../bank/prixod/db');
const { KassaPrixodDB } = require('../kassa/prixod/db');
const { KassaRasxodDB } = require('../kassa/rasxod/db');
const { AvansDB } = require('../avans/db');
const { BudjetDB } = require('../spravochnik/budjet/db');
const ExcelJS = require('exceljs');
const { db } = require('../db/index');
const { returnStringDate } = require('../helper/functions');
const path = require('path');
const { PodotchetMonitoringDB } = require('./db')

exports.Controller = class {

    static async getByIdPodotchetMonitoring(req, res) {
        const podotchet_id = req.params.id
        const { limit, page, main_schet_id, from, to, operatsii } = req.query
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;
        const podotchet = await PodotchetDB.getByIdPodotchet([region_id, podotchet_id])

        if (!podotchet) {
            return res.status(404).json({
                message: "podotchet not found"
            })
        }
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }

        const data = await PodotchetMonitoringDB.getByPodotchetIdMonitoring([region_id, main_schet_id, from, to, podotchet_id, operatsii], offset, limit);

        const bank_rasxod_from_summa = await BankRasxodDB.getByPodotchetIdSummaBankRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const bank_prixod_from_summa = await BankPrixodDB.getByPodotchetIdSummaBankPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_prixod_from_summa = await KassaPrixodDB.getByPodotchetIdSummaKassaPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_rasxod_from_summa = await KassaRasxodDB.getByPodotchetIdSummaKassaRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const avans_from_summa = await AvansDB.getByPodotchetIdSummaAvans([region_id, main_schet_id, from, podotchet_id, operatsii])
        const summa_from = (bank_rasxod_from_summa + kassa_rasxod_from_summa) - (bank_prixod_from_summa + kassa_prixod_from_summa + avans_from_summa)

        const bank_rasxod_to_summa = await BankRasxodDB.getByPodotchetIdSummaBankRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const bank_prixod_to_summa = await BankPrixodDB.getByPodotchetIdSummaBankPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_prixod_to_summa = await KassaPrixodDB.getByPodotchetIdSummaKassaPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_rasxod_to_summa = await KassaRasxodDB.getByPodotchetIdSummaKassaRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const avans_to_summa = await AvansDB.getByPodotchetIdSummaAvans([region_id, main_schet_id, to, podotchet_id, operatsii])
        const summa_to = (bank_rasxod_to_summa + kassa_rasxod_to_summa) - (bank_prixod_to_summa + kassa_prixod_to_summa + avans_to_summa)

        const bank_rasxod_total = await BankRasxodDB.getByPodotchetIdTotalBankRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const bank_prixod_total = await BankPrixodDB.getByPodotchetIdTotalBankPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const kassa_prixod_total = await KassaPrixodDB.getByPodotchetIdTotalKassaPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const kassa_rasxod_total = await KassaRasxodDB.getByPodotchetIdTotalKassaRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const avans_total = await AvansDB.getByPodotchetIdTotalAvans([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const total = bank_prixod_total + bank_rasxod_total + kassa_prixod_total + kassa_rasxod_total + avans_total

        let summa_rasxod = 0
        let summa_prixod = 0
        data.forEach(item => {
            summa_rasxod += item.rasxod_sum
            summa_prixod += item.prixod_sum
        })

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_from,
            summa_to,
            summa_prixod,
            summa_rasxod
        }

        return res.status(200).json({
            message: "podotcbet monitoring successfully get",
            meta,
            data
        })
    }

    static async getPodotchetMonitroing(req, res) {
        const { limit, page, main_schet_id, from, to, operatsii } = req.query
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;

        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }

        const data = await PodotchetMonitoringDB.getMonitoring([region_id, main_schet_id, from, to, operatsii, offset, limit])

        const bank_rasxod_from_summa = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, from, operatsii])
        const bank_prixod_from_summa = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, from, operatsii])
        const kassa_prixod_from_summa = await KassaPrixodDB.getBySchetSummaKassaPrixod([region_id, main_schet_id, from, operatsii])
        const kassa_rasxod_from_summa = await KassaRasxodDB.getBySchetSummaKassaRasxod([region_id, main_schet_id, from, operatsii])
        const summa_from = (bank_rasxod_from_summa + kassa_rasxod_from_summa) - (bank_prixod_from_summa + kassa_prixod_from_summa)

        const bank_rasxod_to_summa = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, to, operatsii])
        const bank_prixod_to_summa = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, to, operatsii])
        const kassa_prixod_to_summa = await KassaPrixodDB.getBySchetSummaKassaPrixod([region_id, main_schet_id, to, operatsii])
        const kassa_rasxod_to_summa = await KassaRasxodDB.getBySchetSummaKassaRasxod([region_id, main_schet_id, to, operatsii])
        const summa_to = (bank_rasxod_to_summa + kassa_rasxod_to_summa) - (bank_prixod_to_summa + kassa_prixod_to_summa)

        const bank_rasxod_total = await BankRasxodDB.getBySchetTotalBankRasxod([region_id, main_schet_id, from, to, operatsii])
        const bank_prixod_total = await BankPrixodDB.getBySchetTotalBankPrixod([region_id, main_schet_id, from, to, operatsii])
        const kassa_prixod_total = await KassaPrixodDB.getBySchetTotalKassaPrixod([region_id, main_schet_id, from, to, operatsii])
        const kassa_rasxod_total = await KassaRasxodDB.getBySchetTotalKassaRasxod([region_id, main_schet_id, from, to, operatsii])
        const total = bank_prixod_total + bank_rasxod_total + kassa_prixod_total + kassa_rasxod_total

        let summa_rasxod = 0
        let summa_prixod = 0
        data.forEach(item => {
            summa_rasxod += item.rasxod_sum
            summa_prixod += item.prixod_sum
        })

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_from,
            summa_to,
            summa_prixod,
            summa_rasxod
        }

        return res.status(200).json({
            message: "podotcbet monitoring successfully get",
            meta,
            data
        })
    }

    static async prixodRasxodPodotchet(req, res) {
        const region_id = req.user.region_id;
        const { to, budjet_id } = req.query;
        const bujet = await BudjetDB.getByIdBudjet([budjet_id]);
        if (!bujet) {
            return res.status(404).json({
                message: "budjet not found"
            })
        }
        let data;
        await db.transaction(async (client) => {
            data = await PodotchetDB.getPodotchet([region_id], client);
            for (let podotchet of data) {
                const bank_rasxod_from_summa = await BankRasxodDB.getByPodotchetIdAndBudjetSummaBankRasxod([region_id, budjet_id, to, podotchet.id], client)
                const bank_prixod_from_summa = await BankPrixodDB.getByPodotchetIdAndBudjetSummaBankPrixod([region_id, budjet_id, to, podotchet.id], client)
                const kassa_prixod_from_summa = await KassaPrixodDB.getByPodotchetIdAndBudjetSummaKassaPrixod([region_id, budjet_id, to, podotchet.id], client)
                const kassa_rasxod_from_summa = await KassaRasxodDB.getByPodotchetIdAndBudjetSummaKassaRasxod([region_id, budjet_id, to, podotchet.id], client)
                const avans_from_summa = await AvansDB.getByPodotchetIdAndBudjetSummaAvans([region_id, budjet_id, to, podotchet.id], client)
                const summa = (bank_rasxod_from_summa + kassa_rasxod_from_summa) - (bank_prixod_from_summa + kassa_prixod_from_summa + avans_from_summa)
                podotchet.summa = summa
            }

        })
        const workbook = new ExcelJS.Workbook();
        const fileName = `prixod_rasxod_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('prixod rasxod');
        worksheet.pageSetup.margins.left = 0
        worksheet.pageSetup.margins.header = 0
        worksheet.pageSetup.margins.footer = 0
        worksheet.pageSetup.margins.right = 0
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = `Список Дебеторов / Кредиторов на ${returnStringDate(new Date(to))}`;
        worksheet.getCell('A2').value = 'Подотчетное лицо';
        worksheet.getCell('B2').value = 'Управление';
        worksheet.getCell('C2').value = 'Дата';
        worksheet.getCell('D2').value = 'Дебет';
        worksheet.getCell('E2').value = 'Кредит';
        let row_number = 3
        let itogo_prixod = 0
        let itogo_rasxod = 0
        for (let column of data) {
            if (column.summa === 0) continue;
            worksheet.getCell(`A${row_number}`).value = column.name;
            worksheet.getCell(`B${row_number}`).value = column.rayon;
            worksheet.getCell(`C${row_number}`).value = returnStringDate(new Date(to));
            worksheet.getCell(`D${row_number}`).value = column.summa > 0 ? column.summa : 0;
            worksheet.getCell(`E${row_number}`).value = column.summa < 0 ? Math.abs(column.summa) : 0;
            itogo_prixod += column.summa > 0 ? column.summa : 0;
            itogo_rasxod += column.summa < 0 ? Math.abs(column.summa) : 0;
            const css_array = [`A${row_number}`, `B${row_number}`, `C${row_number}`, `D${row_number}`, `E${row_number}`];
            css_array.forEach((cell, index) => {
                let horizontal = 'center';
                if (index === 0) horizontal = 'left';
                if (index > 2) horizontal = 'right';
                const column = worksheet.getCell(cell);
                column.numFmt = '#,##0.00';
                column.font = { size: 10, color: { argb: 'FF000000' }, name: 'Times New Roman' };
                column.alignment = { vertical: 'middle', horizontal };
                column.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
                column.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
            row_number++;
        }
        worksheet.mergeCells(`A${row_number}`, `C${row_number}`)
        worksheet.getCell(`A${row_number}`).value = 'Итого'
        worksheet.getCell(`D${row_number}`).value = itogo_prixod
        worksheet.getCell(`E${row_number}`).value = itogo_rasxod
        const css_array = ['A1', 'A2', 'B2', 'C2', 'D2', 'E2', `A${row_number}`, `D${row_number}`, `E${row_number}`];
        css_array.forEach((cell, index) => {
            const column = worksheet.getCell(cell)
            let size = 10
            let horizontal = 'center';
            if (index === 0) size = 13;
            if (index > 5) column.numFmt = '#,##0.00', horizontal = 'right';
            Object.assign(column, {
                font: { size, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
        });

        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 18;
        worksheet.getColumn(5).width = 18;
        worksheet.getRow(1).height = 35
        worksheet.getRow(2).height = 20

        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);

        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    }

    static async getByIdPodotchetToExcel(req, res) {
        const podotchet_id = req.params.id
        const { main_schet_id, from, to, operatsii } = req.query;
        const region_id = req.user.region_id;
        const podotchet = await PodotchetDB.getByIdPodotchet([region_id, podotchet_id]);
        if (!podotchet) {
            return res.status(404).json({
                message: "podotchet not found"
            })
        }
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const data = await PodotchetMonitoringDB.getByPodotchetIdMonitoring([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const bank_rasxod_from_summa = await BankRasxodDB.getByPodotchetIdSummaBankRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const bank_prixod_from_summa = await BankPrixodDB.getByPodotchetIdSummaBankPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_prixod_from_summa = await KassaPrixodDB.getByPodotchetIdSummaKassaPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_rasxod_from_summa = await KassaRasxodDB.getByPodotchetIdSummaKassaRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const avans_from_summa = await AvansDB.getByPodotchetIdSummaAvans([region_id, main_schet_id, from, podotchet_id, operatsii])
        const summa_from = (bank_rasxod_from_summa + kassa_rasxod_from_summa) - (bank_prixod_from_summa + kassa_prixod_from_summa + avans_from_summa)
        const bank_rasxod_to_summa = await BankRasxodDB.getByPodotchetIdSummaBankRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const bank_prixod_to_summa = await BankPrixodDB.getByPodotchetIdSummaBankPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_prixod_to_summa = await KassaPrixodDB.getByPodotchetIdSummaKassaPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_rasxod_to_summa = await KassaRasxodDB.getByPodotchetIdSummaKassaRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const avans_to_summa = await AvansDB.getByPodotchetIdSummaAvans([region_id, main_schet_id, to, podotchet_id, operatsii])
        const summa_to = (bank_rasxod_to_summa + kassa_rasxod_to_summa) - (bank_prixod_to_summa + kassa_prixod_to_summa + avans_to_summa)
        let summa_prixod = 0;
        let summa_rasxod = 0;
        for (let item of data) {
            summa_prixod += item.prixod_sum
            summa_rasxod += item.rasxod_sum
        }
        const workbook = new ExcelJS.Workbook();
        const fileName = `kratochka_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('лицевой карточка');
        worksheet.mergeCells('A1', 'I')
        const titleCell = worksheet.getCell(`A1`)
        titleCell.value = ` Подотчетное лицо :  ${podotchet.name}`
        worksheet.mergeCells('A2', 'A3')
        const doc_numCell = worksheet.getCell(`A2`)
        doc_numCell.value = `Номер   документ`
        worksheet.mergeCells('B2', 'B3')
        const doc_dateCell = worksheet.getCell(`B2`)
        doc_dateCell.value = `Дата`
        worksheet.mergeCells('C2', 'C3')
        const opisanieCell = worksheet.getCell(`C2`)
        opisanieCell.value = 'Разъяснительный текст'
        worksheet.mergeCells(`D2`, 'F2')
        const schetDebitCell = worksheet.getCell(`D2`)
        schetDebitCell.value = `Дебет ${operatsii} / Кредит  разных   счетов`
        worksheet.mergeCells(`G2`, 'I2');
        const schetKriditCell = worksheet.getCell(`G2`);
        schetKriditCell.value = `Кредит ${operatsii}  /  Дебет разных счетов`
        const schetCell = worksheet.getCell(`D3`)
        schetCell.value = `счет`;
        const subSchetCell = worksheet.getCell(`E3`)
        subSchetCell.value = `суб счет`
        const summaCell = worksheet.getCell(`F3`)
        summaCell.value = `сумма`;
        const schetCell2 = worksheet.getCell(`G3`)
        schetCell2.value = `счет`;
        const subSchetCell2 = worksheet.getCell(`H3`)
        subSchetCell2.value = `суб счет`
        const summaCell2 = worksheet.getCell(`I3`)
        summaCell2.value = `сумма`;
        worksheet.mergeCells(`A4`, 'C4')
        const summaFromCell = worksheet.getCell(`A4`)
        summaFromCell.value = `Сальдо на начало :  ${returnStringDate(new Date(from))}`
        worksheet.mergeCells(`D4`, 'F4')
        const summa_from_debit = worksheet.getCell(`D4`)
        summa_from_debit.value = summa_from > 0 ? summa_from : 0
        worksheet.mergeCells(`G4`, 'I4')
        const summa_from_kridit = worksheet.getCell(`G4`)
        summa_from_kridit.value = summa_from < 0 ? Math.abs(summa_from) : 0
        let row_number = 5
        for (let column of data) {
            const doc_numCell = worksheet.getCell(`A${row_number}`)
            doc_numCell.value = column.doc_num
            const doc_dateCell = worksheet.getCell(`B${row_number}`)
            doc_dateCell.value = returnStringDate(new Date(column.doc_date))
            const opisanieCell = worksheet.getCell(`C${row_number}`)
            opisanieCell.value = column.opisanie
            const schetCell = worksheet.getCell(`D${row_number}`)
            const subSchetCell = worksheet.getCell(`E${row_number}`)
            const summaCell = worksheet.getCell(`F${row_number}`)
            const schetCell2 = worksheet.getCell(`G${row_number}`)
            const subSchetCell2 = worksheet.getCell(`H${row_number}`)
            const summaCell2 = worksheet.getCell(`I${row_number}`)
            if (column.rasxod_sum) {
                schetCell.value = ''
                subSchetCell.value = ''
                summaCell.value = column.prixod_sum
                schetCell2.value = column.provodki_schet
                subSchetCell2.value = column.provodki_sub_schet
                summaCell2.value = column.rasxod_sum
            } else {
                schetCell.value = column.provodki_schet
                subSchetCell.value = column.provodki_sub_schet
                summaCell.value = column.prixod_sum
                schetCell2.value = ''
                subSchetCell2.value = ''
                summaCell2.value = column.rasxod_sum
            }
            const css_array = [
                doc_numCell,
                doc_dateCell,
                opisanieCell,
                schetCell,
                subSchetCell,
                summaCell,
                schetCell2,
                subSchetCell2,
                summaCell2
            ]
            css_array.forEach((cell, index) => {
                let horizontal = 'center';
                if (index === 2) horizontal = 'left';
                if (index === 5 || index === 8) horizontal = 'right';

                Object.assign(cell, {
                    numFmt: "#,##0.00",
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    },
                    font: { size: 10, color: { argb: 'FF000000' }, name: 'Times New Roman', wrappper: true },
                    alignment: { vertical: 'middle', horizontal, wrapText: true }
                })
            });
            row_number++
        }
        worksheet.mergeCells(`A${row_number}`, `C${row_number}`)
        const itogoCell = worksheet.getCell(`A${row_number}`)
        itogoCell.value = 'итого'
        const schetCell3 = worksheet.getCell(`D${row_number}`)
        schetCell3.value = ''
        const subSchetCell3 = worksheet.getCell(`E${row_number}`)
        subSchetCell3.value = ''
        const summaCell3 = worksheet.getCell(`F${row_number}`)
        summaCell3.value = summa_prixod
        const schetCell4 = worksheet.getCell(`G${row_number}`)
        schetCell4.value = ``
        const subSchetCell4 = worksheet.getCell(`H${row_number}`)
        subSchetCell4.value = ``
        const summaCell4 = worksheet.getCell(`I${row_number}`)
        summaCell4.value = summa_rasxod
        row_number++
        worksheet.mergeCells(`A${row_number}`, `C${row_number}`)
        const summaToCell = worksheet.getCell(`A${row_number}`)
        summaToCell.value = `Сальдо на начало :  ${returnStringDate(new Date(to))}`
        worksheet.mergeCells(`D${row_number}`, `F${row_number}`)
        const summa_to_debit = worksheet.getCell(`D${row_number}`)
        summa_to_debit.value = summa_to > 0 ? summa_to : 0
        worksheet.mergeCells(`G${row_number}`, `I${row_number}`)
        const summa_to_kridit = worksheet.getCell(`G${row_number}`)
        summa_to_kridit.value = summa_to < 0 ? Math.abs(summa_to) : 0
        const css_array = [
            titleCell,
            doc_numCell,
            doc_dateCell,
            opisanieCell,
            schetDebitCell,
            schetKriditCell,
            summaFromCell,
            schetCell,
            subSchetCell,
            summaCell,
            schetCell2,
            subSchetCell2,
            summaCell2,
            summa_from_debit,
            summa_from_kridit,
            itogoCell,
            schetCell3,
            subSchetCell3,
            summaCell3,
            schetCell4,
            subSchetCell4,
            summaCell4,
            summaToCell,
            summa_to_debit,
            summa_to_kridit,
        ]
        css_array.forEach((cell, index) => {
            let horizontal = 'center';
            let styles = {};
            if (index === 0) {
                horizontal = 'left';
            }
            if (index === 6 || index === 15 || index === 22) {
                horizontal = 'left';
            }
            if (index === 13 || index === 14 || index === 18 || index === 21 || index > 22) {
                horizontal = 'right';
            }
            Object.assign(styles, {
                numFmt: "#,##0.00",
                font: { size: 10, color: { argb: 'FF000000' }, name: 'Times New Roman', wrappper: true },
                alignment: { vertical: 'middle', horizontal, wrapText: true },
            });
            if (index !== 0) {
                styles.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
                styles.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
            Object.assign(cell, styles);
        });

        worksheet.getColumn(1).width = 15
        worksheet.getColumn(2).width = 15
        worksheet.getColumn(3).width = 35
        worksheet.getColumn(4).width = 15
        worksheet.getColumn(5).width = 15
        worksheet.getColumn(6).width = 15
        worksheet.getColumn(7).width = 15
        worksheet.getColumn(8).width = 15
        worksheet.getColumn(9).width = 15
        worksheet.getRow(1).height = 30
        worksheet.getRow(2).height = 40
        worksheet.getRow(4).height = 40
        worksheet.getRow(itogoCell.row).height = 40
        worksheet.getRow(summaToCell.row).height = 40
        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    }
}