const { getOrganizationMonitoringService, aktSverkaService, orderOrganizationService, organizationPrixodRasxodService } = require("./organization.monitoring.service");
const { organizationMonitoringValidation, aktSverkaValidation, orderOrganizationValidation, organizationPrixodRasxodValidation } = require("../utils/validation");;
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { errorCatch } = require("../utils/errorCatch");
const { validationResponse } = require("../utils/response-for-validation");
const { resFunc } = require("../utils/resFunc");
const { getByIdOrganizationService } = require('../spravochnik/organization/organization.service')
const { getByIdShartnomaService } = require('../shartnoma/shartnoma.service')
const ExcelJS = require('exceljs')
const path = require('path')
const { returnSleshDate } = require('../utils/date.function');
const { returnStringDate } = require('../utils/date.function')
const { returnExcelColumn } = require('../utils/for-excel')
const { getBySchetService } = require('../spravochnik/operatsii/operatsii.service')
const { getByIdSchetOperatsiiService } = require('../spravochnik/schet.operatsii/schet.operatsii.service')

const getOrganizationMonitoring = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { page, limit, main_schet_id, operatsii_id, spravochnik_organization_id, from, to } = validationResponse(organizationMonitoringValidation, req.query)
        const offset = (page - 1) * limit;
        await getByIdMainSchetService(region_id, main_schet_id);
        const schet = await getByIdSchetOperatsiiService(region_id, operatsii_id)
        if (spravochnik_organization_id) {
            await getByIdOrganizationService(region_id, spravochnik_organization_id)
        }
        const { total, data, summa_prixod, summa_rasxod, summa_from_prixod, summa_from_rasxod, summa_to_prixod, summa_to_rasxod } = await getOrganizationMonitoringService(region_id, main_schet_id, offset, limit, schet.schet, spravochnik_organization_id, from, to);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_prixod,
            summa_rasxod,
            summa_from_prixod, 
            summa_from_rasxod, 
            summa_to_prixod, 
            summa_to_rasxod
        }
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

const aktSverka = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const { main_schet_id, shartnoma_id, from, to } = validationResponse(aktSverkaValidation, req.query);
        await getByIdMainSchetService(region_id, main_schet_id);
        await getByIdShartnomaService(region_id, main_schet_id, shartnoma_id);
        const data = await aktSverkaService(region_id, main_schet_id, shartnoma_id, from, to);
        const head = `Акт сверки взаимарасчетов`;
        const title = `Мы, нижеподписавшиеся Начальник ФЭО Ж.Д. Абраматов О.Мухторов и "${data.organization_name}" АЖ произвели сверку взаимных расчетов между Ж.Д.Абраматов и "${data.organization_name}" АЖ по состоянию на 7/31/2024`;
        const workbook = new ExcelJS.Workbook();
        const fileName = `akt_sverki_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('Акт сверки');
        worksheet.pageSetup.margins.left = 0
        worksheet.pageSetup.margins.header = 0
        worksheet.pageSetup.margins.footer = 0
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
        titleCell.value = title
        const row1Cell = worksheet.getCell('A3');
        row1Cell.value = `Содержание записей`
        const row2Cell = worksheet.getCell('D3');
        row2Cell.value = 'Ж.Д.Абрама'
        const row3Cell = worksheet.getCell('H3');
        row3Cell.value = `${data.organization_name}`
        worksheet.mergeCells('A4', 'C4');
        const empty = worksheet.getCell('A4');
        empty.value = ''
        worksheet.mergeCells('D4', 'E4');
        const debit1 = worksheet.getCell('D4');
        debit1.value = `Дебит`
        worksheet.mergeCells('F4', 'G4');
        const kridit1 = worksheet.getCell('F4')
        kridit1.value = 'Кредит'
        worksheet.mergeCells('H4', 'I4');
        const debit2 = worksheet.getCell('H4');
        debit2.value = `Дебит`
        worksheet.mergeCells('J4', 'K4');
        const kridit2 = worksheet.getCell('J4')
        kridit2.value = 'Кредит'

        worksheet.mergeCells('A5', 'C5');
        const empty2 = worksheet.getCell('A5');
        empty2.value = ''
        worksheet.mergeCells('D5', 'E5');
        const debit1_2 = worksheet.getCell('D5');
        debit1_2.value = data.summa_from > 0 ? data.summa_from : 0
        worksheet.mergeCells('F5', 'G5');
        const kridit1_2 = worksheet.getCell('F5')
        kridit1_2.value = data.summa_from < 0 ? Math.abs(data.summa_from) : 0
        worksheet.mergeCells('H5', 'I5');
        const debit2_2 = worksheet.getCell('H5');
        debit2_2.value = data.summa_from < 0 ? Math.abs(data.summa_from) : 0
        worksheet.mergeCells('J5', 'K5');
        const kridit2_2 = worksheet.getCell('J5')
        kridit2_2.value = data.summa_from > 0 ? data.summa_from : 0
        for (let item of data.array) {
            const row_number = worksheet.lastRow.number + 1
            worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
            const text = `N_${item.doc_num} ${item.opisanie} от ${returnSleshDate(new Date(item.doc_date))}`;
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
        }
        let row_number = worksheet.lastRow.number + 1
        worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
        const empty3 = worksheet.getCell(`A${row_number}`);
        empty3.value = ``
        worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
        const debit3 = worksheet.getCell(`D${row_number}`);
        debit3.value = data.summa_prixod
        worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
        const kridit3 = worksheet.getCell(`F${row_number}`)
        kridit3.value = data.summa_rasxod
        worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
        const debit3_2 = worksheet.getCell(`H${row_number}`);
        debit3_2.value = data.summa_rasxod
        worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
        const kridit3_2 = worksheet.getCell(`J${row_number}`)
        kridit3_2.value = data.summa_prixod
        row_number = row_number + 1

        worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
        const empty4 = worksheet.getCell(`A${row_number}`);
        empty4.value = ``
        worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
        const debit4 = worksheet.getCell(`D${row_number}`);
        debit4.value = data.summa_to > 0 ? data.summa_to : 0
        worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
        const kridit4 = worksheet.getCell(`F${row_number}`)
        kridit4.value = data.summa_to < 0 ? Math.abs(data.summa_to) : 0
        worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
        const debit4_2 = worksheet.getCell(`H${row_number}`);
        debit4_2.value = data.summa_to < 0 ? Math.abs(data.summa_to) : 0
        worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
        const kridit4_2 = worksheet.getCell(`J${row_number}`)
        kridit4_2.value = data.summa_to > 0 ? data.summa_to : 0
        row_number = row_number + 1

        worksheet.mergeCells(`A${row_number}`, `K${row_number}`);
        const footer = worksheet.getCell(`A${row_number}`)
        footer.value = `Сальдо в пользу : Ж.Д. Абраматов. Двести девятнадцать миллионов триста пятьдесят шесть тысяч триста двадцать шесть сум 98 т.`
        worksheet.getRow(row_number).height = 40
        row_number = row_number + 1

        worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
        const podotchet = worksheet.getCell(`A${row_number}`)
        podotchet.value = `Началник ФЭО Ж.Д.Абрама тов О.Мухторов`
        worksheet.mergeCells(`G${row_number}`, `K${row_number}`);
        const organ = worksheet.getCell(`G${row_number}`)
        organ.value = `Руководитель "${data.organization_name}" АЖ`
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
        const filePath = path.join(__dirname, '../../public/uploads/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    } catch (error) {
        errorCatch(error, res);
    }
};

const orderOrganization = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { from, to, schet, main_schet_id } = validationResponse(orderOrganizationValidation, req.query)
        await getBySchetService(schet)
        const main_schet = await getByIdMainSchetService(region_id, main_schet_id)
        const workbook = new ExcelJS.Workbook();
        const fileName = `order_organization_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('order organization');
        worksheet.pageSetup.margins.left = 0
        worksheet.pageSetup.margins.header = 0
        worksheet.pageSetup.margins.footer = 0
        const { data, rasxod_schets, itogo_all_rasxod } = await orderOrganizationService(region_id, schet, from, to, main_schet.id)
        rasxod_schets.push({ schet: main_schet.jur2_schet }, { schet: 'Итого КР' })
        worksheet.mergeCells('A1', 'K1');
        worksheet.mergeCells('A2', 'K2');
        worksheet.mergeCells('A3', 'K3');
        worksheet.mergeCells('A4', 'F5');
        worksheet.mergeCells('G4', 'J4');
        worksheet.mergeCells('G5', 'H5');
        worksheet.mergeCells('I5', 'J5');
        worksheet.mergeCells('L4', `${returnExcelColumn('L', rasxod_schets.length)}4`)
        const headCell = worksheet.getCell('A1');
        const titleCell = worksheet.getCell('A2');
        const date_intervalCell = worksheet.getCell('A3')
        const organization_titleCell = worksheet.getCell('B4')
        const from_dateCell = worksheet.getCell('G4')
        const prixodCell = worksheet.getCell('G5')
        const rasxodCell = worksheet.getCell('I5')
        const prixod_titleCell = worksheet.getCell('K4')
        const schet_prixodCell = worksheet.getCell('K5')
        const rasxod_schetCell = worksheet.getCell('L4')
        headCell.value = `Журнал-Ордер N_3. Счет: ${schet}`;
        titleCell.value = `Расчети c дебеторами и кредиторами`
        date_intervalCell.value = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
        organization_titleCell.value = `Организатсия`;
        from_dateCell.value = `Остаток к началу дня`;
        prixodCell.value = `ДЕБИТ`
        rasxodCell.value = `КРЕДИТ`
        prixod_titleCell.value = `ДЕБИТ СЧЕТ`
        schet_prixodCell.value = `${schet}`
        rasxod_schetCell.value = 'КРЕДИТ СЧЕТА'
        const cell_array = [
            headCell,
            titleCell,
            date_intervalCell,
            organization_titleCell,
            from_dateCell,
            prixodCell,
            rasxodCell,
            prixod_titleCell,
            schet_prixodCell,
            rasxod_schetCell
        ]
        cell_array.forEach((item, index) => {
            let border = null;
            let fill = null;
            let size = 10;
            if (index === 0) size = 14
            if (index === 1 || index === 2) size = 12
            if (index > 2) {
                fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
            }
            const css = {
                font: { size, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill,
                border
            }
            Object.assign(item, css);
        })
        let col_letter = ``
        const schet_columns = []
        rasxod_schets.forEach((col, index) => {
            const colLetter = returnExcelColumn('L', index + 1);
            const schet = worksheet.getCell(`${colLetter}5`);
            schet.value = `${col.schet}`;
            Object.assign(schet, {
                font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
            col_letter = colLetter
            worksheet.getColumn(colLetter).width = 18;
            schet_columns.push({ colLetter, schet: col.schet })
        });
        worksheet.mergeCells(`${returnExcelColumn(col_letter, 2)}4`, `${returnExcelColumn(col_letter, 3)}4`)
        const to_dateCell_colletter = returnExcelColumn(col_letter, 2)
        const itogo_prixod_colletter = returnExcelColumn(col_letter, 2)
        const itogo_rasxod_colletter = returnExcelColumn(col_letter, 3)
        schet_columns.push({ schet: 'Остаток концу дня', colLetter: to_dateCell_colletter }, { schet: 'ДЕБИТ', colLetter: itogo_prixod_colletter }, { schet: 'КРЕДИТ', colLetter: itogo_rasxod_colletter })
        const to_dateCell = worksheet.getCell(`${to_dateCell_colletter}4`)
        const itogo_prixod = worksheet.getCell(`${itogo_prixod_colletter}5`)
        const itogo_rasxod = worksheet.getCell(`${itogo_rasxod_colletter}5`)
        to_dateCell.value = `Остаток концу дня`;
        itogo_prixod.value = `ДЕБИТ`
        itogo_rasxod.value = `КРЕДИТ`
        const itogo_array = [, itogo_prixod, itogo_rasxod, to_dateCell]
        itogo_array.forEach(col => {
            Object.assign(col, {
                font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
        })
        row_number = 6
        let debit_from = 0
        let kridit_from = 0
        let debit = 0
        let debit_to = 0
        let kridit_to = 0
        const rasxod_schet_itogo = []
        for (let organ of data) {
            worksheet.mergeCells(`A${row_number}`, `F${row_number}`)
            worksheet.mergeCells(`G${row_number}`, `H${row_number}`)
            worksheet.mergeCells(`I${row_number}`, `J${row_number}`)
            const organ_nameCell = worksheet.getCell(`A${row_number}`)
            const from_prixodCell = worksheet.getCell(`G${row_number}`)
            const from_rasxodCell = worksheet.getCell(`I${row_number}`)
            const prixodCell = worksheet.getCell(`K${row_number}`)
            const column = schet_columns.find(item => item.schet === 'Итого КР')
            const column_prixod = schet_columns.find(item => item.schet === 'ДЕБИТ')
            const column_rasxod = schet_columns.find(item => item.schet === 'КРЕДИТ')
            const itogo_rasxodCell = worksheet.getCell(`${column.colLetter}${row_number}`)
            const total_rasxodCell = worksheet.getCell(`${column_rasxod.colLetter}${row_number}`)
            const total_prixodCell = worksheet.getCell(`${column_prixod.colLetter}${row_number}`)
            for (let rasxod of organ.rasxod_array) {
                const column = schet_columns.find(item => item.schet === rasxod.schet)
                const index = rasxod_schet_itogo.findIndex(item => item.schet === column.schet)
                if (index !== -1) {
                    rasxod_schet_itogo[index] = { colLetter: column.colLetter, summa: rasxod_schet_itogo[index].summa + rasxod.summa }
                } else {
                    rasxod_schet_itogo.push({ colLetter: column.colLetter, summa: rasxod.summa })
                }
                const schet = worksheet.getCell(`${column.colLetter}${row_number}`)
                schet.value = rasxod.summa
                Object.assign(schet, {
                    numFmt: "#,##0.00",
                    font: { size: 8, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                    alignment: { vertical: 'middle', horizontal: 'right' }
                });
            }
            schet_columns.forEach(col => {
                const column = schet_columns.find(item => item.schet === col.schet)
                const schet = worksheet.getCell(`${column.colLetter}${row_number}`)
                Object.assign(schet, {
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            })
            organ_nameCell.value = `${organ.organization_name}`
            from_prixodCell.value = organ.summa_from > 0 ? organ.summa_from : 0
            from_rasxodCell.value = organ.summa_from < 0 ? Math.abs(organ.summa_from) : 0
            debit_from += from_prixodCell.value
            kridit_from += from_rasxodCell.value
            prixodCell.value = organ.prixod
            debit += prixodCell.value
            itogo_rasxodCell.value = organ.itogo_rasxod
            total_rasxodCell.value = organ.summa_to < 0 ? Math.abs(organ.summa_to) : 0
            total_prixodCell.value = organ.summa_to > 0 ? organ.summa_to : 0
            debit_to += total_prixodCell.value
            kridit_to += total_rasxodCell.value
            const array = [organ_nameCell, from_prixodCell, from_rasxodCell, prixodCell, itogo_rasxodCell, total_rasxodCell, total_prixodCell]
            array.forEach((item, index) => {
                let horizontal = 'left'
                if (index > 0) horizontal = 'right'
                Object.assign(item, {
                    numFmt: "#,##0.00",
                    font: { size: 8, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                    alignment: { vertical: 'middle', horizontal },
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
        worksheet.mergeCells(`G${row_number}`, `H${row_number}`)
        worksheet.mergeCells(`I${row_number}`, `J${row_number}`)
        const debit_fromCell = worksheet.getCell(`G${row_number}`)
        const kridit_fromCell = worksheet.getCell(`J${row_number}`)
        const debitCell = worksheet.getCell(`K${row_number}`)
        const itogo_rasxodColumn = schet_columns.find(item => item.schet === 'Итого КР')
        const itogo_rasxodCell = worksheet.getCell(`${itogo_rasxodColumn.colLetter}${row_number}`)
        const itogo_to_debitColumn = schet_columns.find(item => item.schet === 'ДЕБИТ')
        const itogo_to_debitCell = worksheet.getCell(`${itogo_to_debitColumn.colLetter}${row_number}`)
        const itogo_to_kriditColumn = schet_columns.find(item => item.schet === 'КРЕДИТ')
        const itogo_to_kriditCell = worksheet.getCell(`${itogo_to_kriditColumn.colLetter}${row_number}`)
        itogo_rasxodCell.value = itogo_all_rasxod
        debit_fromCell.value = debit_from
        kridit_fromCell.value = kridit_from
        debitCell.value = debit
        itogo_to_debitCell.value = debit_to
        itogo_to_kriditCell.value = kridit_to
        const itogo_css_array = [itogo_rasxodCell, debit_fromCell, kridit_fromCell, debitCell, itogo_to_debitCell, itogo_to_kriditCell]
        for (let itogo of rasxod_schet_itogo) {
            const itogoCell = worksheet.getCell(`${itogo.colLetter}${row_number}`)
            itogoCell.value = itogo.summa
            itogo_css_array.push(itogoCell)
        }
        itogo_css_array.forEach(item => {
            Object.assign(item, {
                numFmt: "#,##0.00",
                font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
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
        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 25;
        worksheet.getRow(5).height = 25;
        worksheet.getColumn(11).width = 18
        worksheet.getColumn(itogo_prixod_colletter).width = 18
        worksheet.getColumn(itogo_rasxod_colletter).width = 18
        const filePath = path.join(__dirname, '../../public/uploads/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    } catch (error) {
        errorCatch(error, res)
    }
}

const organizationPrixodRasxod = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { to } = validationResponse(organizationPrixodRasxodValidation, req.query)
        const workbook = new ExcelJS.Workbook();
        const fileName = `organization_prixod_rasxod_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('organizatiod prixod rasxod');
        worksheet.pageSetup.margins.left = 0
        worksheet.pageSetup.margins.header = 0
        worksheet.pageSetup.margins.footer = 0
        worksheet.pageSetup.margins.right = 0
        worksheet.mergeCells(`A1`, 'F1')
        const title = worksheet.getCell(`A1`)
        title.value = `${returnStringDate(new Date(to))} дебитор ва счет карзлари тугрисида маълумот`
        const organ_nameCell = worksheet.getCell(`A2`)
        organ_nameCell.value = 'Наименование организации'
        const dataCell = worksheet.getCell(`B2`)
        dataCell.value = `Дата`
        const doc_numCell = worksheet.getCell(`C2`)
        doc_numCell.value = `Доc-дата`
        const becauseCell = worksheet.getCell(`D2`)
        becauseCell.value = `За что`
        const prixodCell = worksheet.getCell(`E2`)
        prixodCell.value = `Дебит`
        const rasxodCell = worksheet.getCell(`F2`)
        rasxodCell.value = 'Кредит'
        const css_array = [title, organ_nameCell, dataCell, doc_numCell, becauseCell, prixodCell, rasxodCell]
        let itogo_rasxod = 0;
        let itogo_prixod = 0;
        const { data } = await organizationPrixodRasxodService(region_id, to)
        let row_number = 3
        for (let column of data) {
            const organ_nameCell = worksheet.getCell(`A${row_number}`)
            organ_nameCell.value = column.name
            const dataCell = worksheet.getCell(`B${row_number}`)
            dataCell.value = `nimadur`
            const doc_numCell = worksheet.getCell(`C${row_number}`)
            doc_numCell.value = `???`
            const becauseCell = worksheet.getCell(`D${row_number}`)
            becauseCell.value = `buni ham bilmadim`
            const prixodCell = worksheet.getCell(`E${row_number}`)
            prixodCell.value = column.summa > 0 ? column.summa : 0
            itogo_prixod += prixodCell.value
            const rasxodCell = worksheet.getCell(`F${row_number}`)
            rasxodCell.value = column.summa < 0 ? Math.abs(column.summa) : 0
            itogo_rasxod += rasxodCell.value
            const css_array = [organ_nameCell, dataCell, doc_numCell, becauseCell, prixodCell, rasxodCell]
            css_array.forEach((item, index) => {
                horizontal = 'center'
                let size = 10;
                if (index === 0 || index == 3) horizontal = 'left';
                if (index === 4 || index === 5) horizontal = 'right';
                Object.assign(item, {
                    numFmt: '#,##0.00',
                    font: { size, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                    alignment: { vertical: 'middle', horizontal },
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
        const itogoStr = worksheet.getCell(`D${row_number}`)
        itogoStr.value = 'Итого'
        const prixod_itogoCell = worksheet.getCell(`E${row_number}`)
        prixod_itogoCell.value = itogo_prixod
        const rasxod_itogoCell = worksheet.getCell(`F${row_number}`)
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
            if (index === 0) fill = {}, border = {}, size = 14;
            if (index === 7) fill = {}, border = {}, horizontal = 'right';
            if (index > 7) horizontal = 'right';
            Object.assign(item, {
                numFmt: '#,##0.00',
                font: { size, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal },
                fill,
                border
            });
        })
        worksheet.getColumn(1).width = 25;
        worksheet.getColumn(2).width = 10;
        worksheet.getColumn(3).width = 10;
        worksheet.getColumn(4).width = 20;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 15;
        worksheet.getRow(1).height = 35;
        const filePath = path.join(__dirname, '../../public/uploads/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    getOrganizationMonitoring,
    aktSverka,
    orderOrganization,
    organizationPrixodRasxod
};
