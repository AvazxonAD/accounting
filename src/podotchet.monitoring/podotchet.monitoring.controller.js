const { podotchetQueryValidation, prixodRasxodPodotchetValidation } = require("../utils/validation");;
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { getLogger } = require('../utils/logger')
const { validationResponse } = require('../utils/response-for-validation');
const { errorCatch } = require("../utils/errorCatch");
const { resFunc } = require("../utils/resFunc");
const { getMonitoringService, prixodRasxodPodotchetService, getByIdPodotchetMonitoringService, podotchetMonitoringToExcelService } = require('./podotchet.monitoring.service')
const { getByIdPodotchetService } = require('../spravochnik/podotchet/podotchet.litso.service')
const ExcelJS = require('exceljs')
const { returnStringDate, returnLocalDate } = require('../utils/date.function')
const path = require(`path`)
const { returnStringSumma } = require('../utils/returnSumma')

const getByPodotchetIdMonitoring = async (req, res) => {
    try {
        const podotchet_id = req.params.id
        const { limit, page, main_schet_id, from, to, operatsii } = validationResponse(podotchetQueryValidation, req.query);
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;
        await getByIdPodotchetService(region_id, podotchet_id)
        await getByIdMainSchetService(region_id, main_schet_id);
        const { total, summa_prixod, summa_rasxod, data, summa_from, summa_to } = await getByIdPodotchetMonitoringService(
            region_id,
            main_schet_id,
            offset,
            limit,
            from,
            to,
            podotchet_id,
            operatsii
        );
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
        getLogger.info(`Muvaffaqiyatli podotchet monitoring doclar olindi. UserId: ${req.user.id}`)
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getMonitoring = async (req, res) => {
    try {
        const { limit, page, main_schet_id, from, to, operatsii } = validationResponse(podotchetQueryValidation, req.query);
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;
        await getByIdMainSchetService(region_id, main_schet_id);
        const { total, summa_prixod, summa_rasxod, data, summa_from, summa_to } = await getMonitoringService(
            region_id,
            main_schet_id,
            offset,
            limit,
            from,
            to,
            operatsii
        );
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
        getLogger.info(`Muvaffaqiyatli podotchet monitoring doclar olindi. UserId: ${req.user.id}`)
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

const prixodRasxodPodotchet = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const { to, main_schet_id } = validationResponse(prixodRasxodPodotchetValidation, req.query);
        const main_schet = await getByIdMainSchetService(region_id, main_schet_id)
        const data = await prixodRasxodPodotchetService(region_id, main_schet.spravochnik_budjet_name_id, to);

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
            worksheet.getCell(`C${row_number}`).value = returnLocalDate(new Date(to));
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
    } catch (error) {
        errorCatch(error, res);
    }
};

const getByPodotchetIdMonitoringToExcel = async (req, res) => {
    try {
        const podotchet_id = req.params.id
        const { main_schet_id, from, to, operatsii } = validationResponse(podotchetQueryValidation, req.query);
        const region_id = req.user.region_id;
        const podotchet = await getByIdPodotchetService(region_id, podotchet_id)
        const { summa_prixod, summa_rasxod, data, summa_from, summa_to } = await podotchetMonitoringToExcelService(
            region_id,
            main_schet_id,
            from,
            to,
            podotchet_id,
            operatsii
        );
        const workbook = new ExcelJS.Workbook();
        const fileName = `litsavoy_kartochka_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('лицевой карточка');
        worksheet.pageSetup.margins.left = 0
        worksheet.pageSetup.margins.header = 0
        worksheet.pageSetup.margins.footer = 0
        worksheet.pageSetup.margins.right = 0
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
        schetCell.value = `счет`
        const subSchetCell = worksheet.getCell(`E3`)
        subSchetCell.value = `суб счет`
        const summaCell = worksheet.getCell(`F3`)
        summaCell.value = `сумма`
        const schetCell2 = worksheet.getCell(`G3`)
        schetCell2.value = `счет`
        const subSchetCell2 = worksheet.getCell(`H3`)
        subSchetCell2.value = `суб счет`
        const summaCell2 = worksheet.getCell(`I3`)
        summaCell2.value = `сумма`
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
            schetCell.value = column.operatsii
            const subSchetCell = worksheet.getCell(`E${row_number}`)
            subSchetCell.value = column.sub_schet
            const summaCell = worksheet.getCell(`F${row_number}`)
            summaCell.value = column.prixod_sum
            const schetCell2 = worksheet.getCell(`G${row_number}`)
            schetCell2.value = column.operatsii
            const subSchetCell2 = worksheet.getCell(`H${row_number}`)
            subSchetCell2.value = column.sub_schet
            const summaCell2 = worksheet.getCell(`I${row_number}`)
            summaCell2.value = column.rasxod_sum
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
                if(index === 5 || index === 8) horizontal = 'right';

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
            let fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
            let border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            }
            if (index === 0) horizontal = 'left', fill = {}, border = {};
            if (index === 6 || index === 15 || index === 22) horizontal = 'left';
            if (index === 13 || index === 14 || index === 18 || index === 21 || index > 22) horizontal = 'right';

            Object.assign(cell, {
                numFmt: "#,##0.00",
                font: { size: 10, color: { argb: 'FF000000' }, name: 'Times New Roman', wrappper: true },
                alignment: { vertical: 'middle', horizontal, wrapText: true },
                fill, border
            })
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
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    getByPodotchetIdMonitoring,
    prixodRasxodPodotchet,
    getMonitoring,
    getByPodotchetIdMonitoringToExcel
};
