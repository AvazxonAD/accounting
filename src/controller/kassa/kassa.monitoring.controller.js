const { getAllMonitoring, kassaCapService, dailyReportService } = require("../../service/kassa/kassa.monitoring.service");
const { queryValidation, bankCapValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { errorCatch } = require("../../helpers/errorCatch");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { returnStringDate } = require('../../utils/date.function')
const path = require('path')
const ExcelJS = require('exceljs')
const { returnStringSumma } = require('../../utils/returnSumma')


const getAllKassaMonitoring = async (req, res, next) => {
  try {
    const region_id = req.user.region_id
    const { page, limit, main_schet_id, from, to } = validationResponse(queryValidation, req.query)
    const offset = (page - 1) * limit;
    await getByIdMainSchetService(region_id, main_schet_id);
    const { total, data, summa_from, summa_to, prixod_sum, rasxod_sum } = await getAllMonitoring(region_id, main_schet_id, offset, limit, from, to);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      prixod_sum,
      rasxod_sum,
      summa_from,
      summa_to,
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
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id);

    const title = `Дневной отчет по Журнал-Ордеру №2. Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${returnStringSumma(main_schet.account_number)}`;
    const dateBetween = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
    const data = await kassaCapService(region_id, main_schet_id, from, to);
    const workbook = new ExcelJS.Workbook();
    const fileName = `kassa_shapka_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet('Hisobot');

    // Title
    worksheet.mergeCells('A1', 'C1');
    const titleCell = worksheet.getCell('A1');
    Object.assign(titleCell, {
      value: title,
      font: { size: 15, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    worksheet.getRow(1).height = 30;

    // Date Range
    worksheet.mergeCells('A2', 'C2');
    const dateCell = worksheet.getCell('A2');
    Object.assign(dateCell, {
      value: dateBetween,
      font: { size: 14, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    });
    worksheet.getRow(2).height = 25;

    // Balance from
    const balanceFromCell = worksheet.getCell('A4');
    balanceFromCell.value = `Остаток к началу дня: ${returnStringSumma(data.balance_from)}`;
    Object.assign(balanceFromCell, {
      font: { size: 14, bold: true, color: { argb: '80000000' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    });

    // Header Row
    const headerRow = worksheet.addRow(['Счет-Субсчет', 'Приход', 'Расход']);
    headerRow.height = 40;
    headerRow.eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, size: 14 },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    });

    // Data Rows
    for (let item of data.data) {
      const row = worksheet.addRow([
        item.schet,
        returnStringSumma(item.prixod_sum),
        returnStringSumma(item.rasxod_sum)
      ]);
      row.height = 25;
      row.eachCell((cell, colNumber) => {
        let cellStyle = {
          font: { size: 12 },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } },
          border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
          alignment: { wrapText: true, horizontal: 'center' }
        };

        // Aligning text
        if (colNumber === 2 || colNumber === 3) {
          cellStyle.alignment.horizontal = 'right'; // Right-aligning incoming and outgoing sums
        }

        Object.assign(cell, cellStyle);
      });
    }

    // Total Row
    worksheet.addRow(['Всего', returnStringSumma(data.prixod_sum), returnStringSumma(data.rasxod_sum)]).eachCell((cell) => {
      let cellStyle = {
        font: { bold: true, size: 14 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        alignment: { vertical: 'middle', horizontal: 'center' }
      };

      Object.assign(cell, cellStyle);
    });

    // Balance to
    const balanceToCell = worksheet.getCell('A' + (worksheet.rowCount + 1));
    balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to)}`;
    Object.assign(balanceToCell, {
      font: { bold: true, size: 14 },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Column Widths
    worksheet.getColumn('A').width = 40;
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 60;

    // Write file
    const filePath = path.join(__dirname, '../../../public/uploads/' + fileName);
    await workbook.xlsx.writeFile(filePath);

    // Download file
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

    const title = `Дневной отчет по Журнал-Ордеру №2. Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${returnStringSumma(main_schet.account_number)}`;
    const dateBetween = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
    const data = await dailyReportService(region_id, main_schet_id, from, to);
    const workbook = new ExcelJS.Workbook();
    const fileName = `kundalik_hisobot_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet('Hisobot');

    worksheet.mergeCells('A1', 'C1');
    const titleCell = worksheet.getCell('A1');
    Object.assign(titleCell, {
      value: title,
      font: { size: 15, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'left' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.getRow(1).height = 30;
    worksheet.mergeCells('A2', 'C2');
    const dateCell = worksheet.getCell('A2');
    Object.assign(dateCell, {
      value: dateBetween,
      font: { size: 14, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'left' }
    });
    worksheet.getRow(2).height = 25;

    const balanceFromCell = worksheet.getCell('A4');
    balanceFromCell.value = `Остаток к началу дня: ${returnStringSumma(data.balance_from)}`;
    Object.assign(balanceFromCell, {
      font: { size: 14, bold: true, color: { argb: '80000000' } },
      alignment: { vertical: 'middle', horizontal: 'left' }
    });

    const headerRow = worksheet.addRow(['№ док', 'Дата', 'Разъяснительный текст', 'Счет-Субсчет', 'Приход', 'Расход', 'Операции']);
    headerRow.height = 40;
    headerRow.eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, size: 14 },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    });

    for (let object of data.data) {
      object.docs.forEach(item => {
        const operatsii = item.rasxod_sum ? `${item.schet} - ${main_schet.jur2_schet}` : `${main_schet.jur2_schet} - ${item.schet}`;
        const row = worksheet.addRow([
          item.doc_num,
          item.doc_date,
          item.opisanie,
          item.schet,
          returnStringSumma(item.prixod_sum),
          returnStringSumma(item.rasxod_sum),
          operatsii
        ]);

        if (item.opisanie) {
          const opisanieLength = item.opisanie.length;
          const baseHeight = 10;
          const lineHeight = 20;
          const maxLines = Math.ceil(opisanieLength / 50);
          row.height = baseHeight + (maxLines * lineHeight);
        } else {
          row.height = 25;
        }

        row.eachCell((cell, colNumber) => {
          let cellStyle = {};
          if (colNumber === 4) {
            cellStyle = {
              font: { size: 12 },
              fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } },
              border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
              alignment: { wrapText: true }
            };
          } else if (colNumber === 6 || colNumber === 7) {
            cellStyle = {
              font: { size: 12 },
              fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } },
              border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
              alignment: { horizontal: 'right' }
            };
          } else {
            cellStyle = {
              font: { size: 12 },
              fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } },
              border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
              alignment: { horizontal: 'center' }
            };
          }
          Object.assign(cell, cellStyle);
        });
      });
    }

    worksheet.addRow(['Всего', ' ', ' ', ' ', ' ', returnStringSumma(data.prixod_sum), returnStringSumma(data.rasxod_sum)]).eachCell((cell, colNumber) => {
      let cellStyle = {
        font: { bold: true, size: 14 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      };

      if (colNumber < 6) {
        cellStyle.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cellStyle.alignment = { vertical: 'middle', horizontal: 'right' };
      }

      Object.assign(cell, cellStyle);
    });

    const balanceToCell = worksheet.getCell('A' + (worksheet.rowCount + 1));
    balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to)}`;
    Object.assign(balanceToCell, {
      font: { bold: true, size: 14 },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.getColumn('A').width = 40;
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 50;
    worksheet.getColumn('D').width = 50;
    worksheet.getColumn('E').width = 25;
    worksheet.getColumn('F').width = 25;
    worksheet.getColumn('G').width = 25;

    const filePath = path.join(__dirname, '../../../public/uploads/' + fileName);
    await workbook.xlsx.writeFile(filePath);

    return res.download(filePath, (err) => {
      if (err) throw new ErrorResponse(err, err.statusCode);
    });
  } catch (error) {
    errorCatch(error, res);
  }
};


module.exports = {
  getAllKassaMonitoring,
  capExcelCreate,
  dailyExcelCreate
};
