const { getAllMonitoring, kassaCapService, dailyReportService } = require("../../service/kassa/kassa.monitoring.service");
const { queryValidation, bankCapValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { errorCatch } = require("../../helpers/errorCatch");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { returnStringDate } = require('../../utils/date.function')
const path = require('path')
const ExcelJS = require('exceljs')


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
    const title = `Дневной отчет шапка Ж.О. №2. Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${main_schet.account_number}`;
    const dateBetween = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
    const data = await kassaCapService(region_id, main_schet_id, from, to);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hisobot');

    worksheet.mergeCells('A1', 'C1');
    const titleCell = worksheet.getCell('A1');
    Object.assign(titleCell, {
      value: title,
      font: { size: 16, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.mergeCells('A2', 'B2');
    const dateCell = worksheet.getCell('A2');
    Object.assign(dateCell, {
      value: dateBetween,
      font: { size: 14, bold: true, color: { argb: 'FF000000' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    });

    worksheet.columns = [
      { header: 'Счет', key: 'schet', width: 40 },
      { header: 'Приход', key: 'prixod', width: 40 },
      { header: 'Расход', key: 'rasxod', width: 40 }
    ];

    const summa_from = `Остаток к началу дня: ${data.balance_from.toFixed(2)}`;
    worksheet.mergeCells('A4', 'B4');
    const summaFrom = worksheet.getCell('A4');
    Object.assign(summaFrom, {
      value: summa_from,
      font: { size: 14, bold: true, color: { argb: '80000000' } },
      alignment: { vertical: 'middle', horizontal: 'left' }
    });

    const headerRow = worksheet.addRow({ schet: 'Счет', prixod: 'Приход', rasxod: 'Расход' });
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, size: 14 },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    });

    data.data.forEach(item => {
      const row = worksheet.addRow({
        schet: item.schet,
        prixod: item.prixod_sum.toFixed(2),
        rasxod: item.rasxod_sum.toFixed(2)
      });
      row.height = 20;
      row.eachCell((cell) => {
        Object.assign(cell, {
          font: { size: 12 },
          alignment: { vertical: 'middle', horizontal: 'center' },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } },
          border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
      });
    });

    const resultRow = worksheet.addRow({ schet: 'Всего', prixod: data.prixod_sum.toFixed(2), rasxod: data.rasxod_sum.toFixed(2) });
    resultRow.eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, size: 14 },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    });

    const summaToRow = worksheet.addRow({ schet: `Остаток концу дня: ${data.balance_to.toFixed(2)}` });
    summaToRow.eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, size: 14 },
        alignment: { vertical: 'middle', horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    });

    const fileName = `bank_shapka_${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '../../../public/uploads/', fileName);
    await workbook.xlsx.writeFile(filePath);

    return res.download(filePath, err => {
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

    const title = `Дневной отчет по Журнал-Ордеру №2. Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${main_schet.account_number}`;
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
    balanceFromCell.value = `Остаток к началу дня: ${data.balance_from.toFixed(2)}`;
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
          item.prixod_sum.toFixed(2),
          item.rasxod_sum.toFixed(2),
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

    worksheet.addRow(['Всего', ' ', ' ', ' ', ' ', data.prixod_sum.toFixed(2), data.rasxod_sum.toFixed(2)]).eachCell((cell, colNumber) => {
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
    balanceToCell.value = `Остаток концу дня: ${data.balance_to.toFixed(2)}`;
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
