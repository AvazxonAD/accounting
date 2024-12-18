const { getAllMonitoring, bankCapService, dailyReportService } = require("./bank.monitoring.service");
const { bankQueryValidation, bankCapValidation } = require("../utils/validation");
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { validationResponse } = require('../utils/response-for-validation');
const { errorCatch } = require("../utils/errorCatch");
const { resFunc } = require("../utils/resFunc");
const ExcelJS = require('exceljs');
const path = require('path');
const ErrorResponse = require("../utils/errorResponse");
const { returnStringDate, returnSleshDate } = require('../utils/date.function');
const { returnStringSumma, probelNumber } = require('../utils/returnSumma')

const getAllBankMonitoring = async (req, res) => {
  try {
    const { limit, page, main_schet_id, from, to } = validationResponse(bankQueryValidation, req.query)
    const region_id = req.user.region_id;
    const offset = (page - 1) * limit;
    await getByIdMainSchetService(region_id, main_schet_id);
    const { total, prixod_sum, rasxod_sum, summaFrom, summaTo, data } = await getAllMonitoring(
      region_id,
      main_schet_id,
      offset,
      limit,
      from,
      to
    );
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      prixod_sum,
      rasxod_sum,
      summa_from: summaFrom,
      summa_to: summaTo
    }
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

const capExcelCreate = async (req, res) => {
  try {
    const { from, to, main_schet_id } = validationResponse(bankCapValidation, req.query);
    const region_id = req.user.region_id;
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id); 0
    const title = `Дневной отчет по Журнал-Ордеру №2. Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${probelNumber(main_schet.account_number)}`;
    const dateBetween = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
    const data = await bankCapService(region_id, main_schet_id, from, to);
    const workbook = new ExcelJS.Workbook();
    const fileName = `bank_shapka_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet('Hisobot');
    worksheet.mergeCells('A1', 'G1');
    const titleCell = worksheet.getCell('A1');
    Object.assign(titleCell, {
      value: title,
      font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'center' },
    });
    worksheet.getRow(1).height = 30;
    worksheet.getColumn(1).width = 5
    worksheet.getColumn(2).width = 7
    worksheet.getColumn(3).width = 27
    worksheet.getColumn(4).width = 27

    worksheet.mergeCells('A2', 'D2');
    const dateCell = worksheet.getCell('A2');
    Object.assign(dateCell, {
      value: dateBetween,
      font: { size: 12, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'center' },
    });
    worksheet.getRow(2).height = 25;
    worksheet.mergeCells('A4', 'D4');
    const balanceFromCell = worksheet.getCell('A4');
    const balance_from = `Остаток к началу дня: ${returnStringSumma(data.balance_from)}`;
    Object.assign(balanceFromCell, {
      value: balance_from,
      font: { size: 12, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'left' },
    });
    worksheet.mergeCells('A5:B5');
    const headerCell = worksheet.getCell('A5');
    Object.assign(headerCell, {
      value: 'Счет',
      font: { bold: true, size: 12, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    });
    worksheet.getCell('C5').value = 'Приход';
    worksheet.getCell('D5').value = 'Расход';
    [worksheet.getCell('C5'), worksheet.getCell('D5')].forEach((cell) => {
      Object.assign(cell, {
        font: { bold: true, size: 12, name: 'Times New Roman' },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      });
    });
    worksheet.getRow(5).height = 30;
    let row_number = 5
    for (let item of data.data) {
      worksheet.mergeCells(`A${row_number + 1}:B${row_number + 1}`);
      const schet = worksheet.getCell(`A${row_number + 1}`)
      Object.assign(schet, {
        value: item.schet,
        font: { name: 'Times New Roman' },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      });
      const prixod_sum = worksheet.getCell(`C${row_number + 1}`);
      prixod_sum.value = item.prixod_sum;
      prixod_sum.numFmt = '#,##0.00';
      const rasxod_sum = worksheet.getCell(`D${row_number + 1}`);
      rasxod_sum.value = item.rasxod_sum;
      rasxod_sum.numFmt = '#,##0.00';
      const array = [prixod_sum, rasxod_sum];
      array.forEach(cell => {
        Object.assign(cell, {
          font: { name: 'Times New Roman', size: 12 },
          alignment: { vertical: 'middle', horizontal: 'right' },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        });
      });
      row_number++
    }
    worksheet.mergeCells(`A${row_number + 1}:B${row_number + 1}`);
    const summa = worksheet.getCell(`A${row_number + 1}`);
    summa.value = 'Всего'
    Object.assign(summa, {
      font: { bold: true, size: 12, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
    const all_prixod_summa = worksheet.getCell(`C${row_number + 1}`);
    all_prixod_summa.value = data.prixod_sum
    all_prixod_summa.numFmt = '#,##0.00';
    const all_rasxod_summa = worksheet.getCell(`D${row_number + 1}`);
    all_rasxod_summa.value = data.rasxod_sum
    all_rasxod_summa.numFmt = '#,##0.00';
    const summa_array = [all_prixod_summa, all_rasxod_summa]
    summa_array.forEach((cell) => {
      Object.assign(cell, {
        font: { bold: true, size: 12, name: 'Times New Roman' },
        alignment: { vertical: 'middle', horizontal: 'right' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      });
    });
    row_number++
    worksheet.mergeCells(`A${row_number + 1}`, `D${row_number + 1}`);
    const balanceToCell = worksheet.getCell('A' + (row_number + 1));
    balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to)}`;
    Object.assign(balanceToCell, {
      font: { size: 12, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'left' },
    });
    row_number++
    worksheet.mergeCells(`A${row_number + 2}`, `C${row_number + 2}`);
    const signature = worksheet.getCell(`A${row_number + 2}`);
    signature.value = 'Главный бухгалтер ___________________________'
    worksheet.mergeCells(`A${row_number + 3}`, `C${row_number + 3}`);
    const signature2 = worksheet.getCell(`A${row_number + 3}`);
    signature2.value = 'Бухгалтер    __________________________________'
    worksheet.mergeCells(`A${row_number + 4}`, `C${row_number + 4}`)
    const signature3 = worksheet.getCell(`A${row_number + 4}`)
    signature3.value = `Получил кассир  ______________________________`
    const signature_array = [signature, signature2, signature3]
    signature_array.forEach(row => {
      Object.assign(row, {
        font: { bold: true, size: 12, name: 'Times New Roman' },
        alignment: { vertical: 'bottom', horizontal: 'left' }
      });
    });
    worksheet.getRow(row_number + 2).height = 30;
    worksheet.getRow(row_number + 3).height = 30;
    worksheet.getRow(row_number + 4).height = 30;
    const filePath = path.join(__dirname, '../../public/exports/' + fileName);
    await workbook.xlsx.writeFile(filePath);
    return res.download(filePath, (err) => {
      if (err) throw new ErrorResponse(err, err.statusCode);
    });
  } catch (error) {
    errorCatch(error, res);
  }
};


const dailyExcelCreate = async (req, res) => {
  try {
    const { from, to, main_schet_id } = validationResponse(bankCapValidation, req.query);
    const region_id = req.user.region_id;
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
    const title = `Дневной отчет по Журнал-Ордеру №2. Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${probelNumber(main_schet.account_number)}`;
    const dateBetween = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
    const data = await dailyReportService(region_id, main_schet_id, from, to);
    const workbook = new ExcelJS.Workbook();
    const fileName = `kundalik_hisobot_bank_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet('Hisobot');
    worksheet.pageSetup.margins.left = 0
    worksheet.pageSetup.margins.header = 0
    worksheet.pageSetup.margins.footer = 0
    worksheet.mergeCells('A1', 'H1');
    const titleCell = worksheet.getCell('A1');
    Object.assign(titleCell, {
      value: title,
      font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'left' }
    });
    worksheet.mergeCells('A2', 'H2');
    const dateCell = worksheet.getCell('A2');
    Object.assign(dateCell, {
      value: dateBetween,
      font: { size: 11, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'left' }
    });
    worksheet.mergeCells('A4', 'H4');
    const balanceFromCell = worksheet.getCell('A4');
    balanceFromCell.value = `Остаток к началу дня: ${returnStringSumma(data.balance_from)}`;
    Object.assign(balanceFromCell, {
      font: { size: 11, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'left' }
    });
    const doc_num = worksheet.getCell('A5');
    const date = worksheet.getCell('B5')
    const organization = worksheet.getCell(`C5`)
    const comment = worksheet.getCell('D5')
    const schet = worksheet.getCell('E5')
    const prixod = worksheet.getCell('F5')
    const rasxod = worksheet.getCell('G5')
    date.value = `Дата`
    comment.value = 'Разъяснительный текст'
    doc_num.value = `№ док`;
    organization.value = `Организатсия`
    schet.value = `Счет`
    prixod.value = 'Приход'
    rasxod.value = 'Расход'
    const headers = [date, comment, organization, doc_num, schet, prixod, rasxod]
    headers.forEach((item, index) => {
      let horizontal = 'center'
      if(index === 3){
        horizontal = 'left'
      }
      Object.assign(item, {
        font: { bold: true, size: 10, name: 'Times New Roman' },
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
    let row_number = 5
    for (let object of data.data) {
      object.docs.forEach(item => {
        const doc_num = worksheet.getCell(`A${row_number + 1}`);
        const date = worksheet.getCell(`B${row_number + 1}`)
        const organization = worksheet.getCell(`C${row_number + 1}`)
        const comment = worksheet.getCell(`D${row_number + 1}`)
        const schet = worksheet.getCell(`E${row_number + 1}`)
        const rasxod = worksheet.getCell(`G${row_number + 1}`)
        const prixod = worksheet.getCell(`F${row_number + 1}`)
        date.value = returnSleshDate(new Date(item.doc_date))
        organization.value = item.spravochnik_organization_name
        comment.value = item.opisanie
        doc_num.value = item.doc_num
        schet.value = item.schet
        prixod.value = item.prixod_sum
        prixod.numFmt = '#,##0.00'
        rasxod.value = item.rasxod_sum
        rasxod.numFmt = '#,##0.00'
        const array = [doc_num, date, comment, schet, rasxod, prixod, organization]
        array.forEach((item, index) => {
          const alignment = { vertical: 'middle' }
          if (index === 2 || index === 7 || index === 0) {
            alignment.horizontal = 'left'
            alignment.wrapText = true
          } else if (index === 4 || index === 5) {
            alignment.horizontal = 'right'
          } else {
            alignment.horizontal = 'center'
          }
          Object.assign(item, {
            alignment,
            font: { name: 'Times New Roman' },
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
      })
      worksheet.mergeCells(`A${row_number + 1}`, `E${row_number + 1}`);
      const schet = worksheet.getCell(`A${row_number + 1}`)
      schet.value = `Итого по счету ${object.schet}`
      const prixod_sum = worksheet.getCell(`F${row_number + 1}`)
      prixod_sum.value = object.prixod_sum
      prixod_sum.numFmt = '#,##0.00'
      const rasxod_sum = worksheet.getCell(`G${row_number + 1}`)
      rasxod_sum.value = object.rasxod_sum
      rasxod_sum.numFmt = '#,##0.00'
      const array = [schet, prixod_sum, rasxod_sum]
      array.forEach((item, index) => {
        let horizontal = `right`
        if (index === 0) {
          horizontal = `left`
        }
        Object.assign(item, {
          alignment: { vertical: 'middle', horizontal },
          font: { name: 'Times New Roman', bold: true, size: 10 },
        });
      })
      row_number++
    }
    const itogo_prixod = worksheet.getCell(`F${row_number + 1}`)
    itogo_prixod.value = data.prixod_sum
    const itogo_rasxod = worksheet.getCell(`G${row_number + 1}`)
    itogo_rasxod.value = data.rasxod_sum
    const itogo_array = [itogo_prixod, itogo_rasxod]
    itogo_array.forEach((item, index) => {
      Object.assign(item, {
        numFmt: '#,##0.00',
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
    worksheet.mergeCells(`A${row_number + 2}`, `H${row_number + 2}`);
    const balanceToCell = worksheet.getCell(`A${row_number + 2}`);
    balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to)}`;
    Object.assign(balanceToCell, {
      font: { size: 11, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
      alignment: { vertical: 'middle', horizontal: 'left' }
    });
    worksheet.getColumn(1).width = 10
    worksheet.getColumn(2).width = 10
    worksheet.getColumn(3).width = 10
    worksheet.getColumn(4).width = 10
    worksheet.getColumn(5).width = 10
    worksheet.getColumn(6).width = 18
    worksheet.getColumn(7).width = 18
    worksheet.getColumn(8).width = 10
    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 20;
    worksheet.getRow(5).height = 25;
    const filePath = path.join(__dirname, '../../public/exports/' + fileName);
    await workbook.xlsx.writeFile(filePath);

    return res.download(filePath, (err) => {
      if (err) throw new ErrorResponse(err, err.statusCode);
    });
  } catch (error) {
    errorCatch(error, res);
  }
};

module.exports = { getAllBankMonitoring, capExcelCreate, dailyExcelCreate };