const { getAllMonitoring, bankCapService, dailyReportService } = require("../../service/bank/bank.monitoring.service");
const { queryValidation, bankCapValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getLogger } = require('../../helpers/log_functions/logger')
const { validationResponse } = require('../../helpers/response-for-validation');
const { errorCatch } = require("../../helpers/errorCatch");
const { resFunc } = require("../../helpers/resFunc");
const XLSX = require('xlsx')
const path = require('path');
const ErrorResponse = require("../../utils/errorResponse");
const { returnStringDate } = require('../../utils/date.function')

const getAllBankMonitoring = async (req, res) => {
  try {
    const { limit, page, main_schet_id, from, to } = validationResponse(queryValidation, req.query)
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
    getLogger.info(`Muvaffaqiyatli bank monitoring doclar olindi. UserId: ${req.user.id}`)
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

const capExcelCreate = async (req, res) => {
  try {
    const { from, to, main_schet_id } = validationResponse(bankCapValidation, req.query);
    const region_id = req.user.region_id;
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id)
    const title = `Дневной отчет шапка Ж.О. №2.  Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${main_schet.account_number}`;
    const dateBetween = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
    const data = await bankCapService(region_id, main_schet_id, from, to);
    const workBook = XLSX.utils.book_new();
    const fileName = `bank_shapka_${new Date().getTime()}.xlsx`;
    const sheetData = [
      [title],
      [dateBetween],
      [`Остаток к началу дня: ${data.balance_from.toFixed(2)}`], 
      ['Счет', 'Приход', 'Расход'],  
    ];
    data.data.forEach(item => {
      sheetData.push([item.schet, item.prixod_sum.toFixed(2), item.rasxod_sum.toFixed(2)]);
    });
    sheetData.push(['Всего', data.prixod_sum.toFixed(2), data.rasxod_sum.toFixed(2)]);
    sheetData.push([`Остаток концу дня: ${data.balance_to.toFixed(2)}`]); 
    const workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    workSheet['!cols'] = [
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Hisobot');
    const filePath = path.join(__dirname, '../../../public/uploads/' + fileName);
    XLSX.writeFile(workBook, filePath);
    return res.download(filePath, (err) => {
      if (err) {
        throw new ErrorResponse(err, err.statusCode);
      }
    });
  } catch (error) {
    errorCatch(error, res);
  }
};

const dailyExcelCreate = async (req, res) => {
  try {
    const { from, to, main_schet_id } = validationResponse(bankCapValidation, req.query);
    const region_id = req.user.region_id;
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id)
    const title = `Дневной отчет по Журнал-Ордеру №2.  Счет: ${main_schet.jur2_schet}. Ҳисоб рақами: ${main_schet.account_number}`;
    const dateBetween = `За период с ${returnStringDate(new Date(from))} по ${returnStringDate(new Date(to))}`;
    const data = await dailyReportService(region_id, main_schet_id, from, to);
    const workBook = XLSX.utils.book_new();
    const fileName = `kundalik_hisobot_${new Date().getTime()}.xlsx`;
    const sheetData = [
      [title],
      [dateBetween],
      [`Остаток к началу дня: ${data.balance_from.toFixed(2)}`], 
      ['№ док', 'Дата', 'Разъяснительный текст', 'Счет-Субсчет', 'Приход', 'Расход', 'Операции'],  
    ];
    for(let object of data.data){
      object.docs.forEach(item => {
        let operatsii = ``
        if(item.rasxod_sum){
          operatsii = `${item.schet} - ${main_schet.jur2_schet}`
        }else{
          operatsii = `${main_schet.jur2_schet} - ${item.schet}`
        }
        sheetData.push([item.doc_num, item.doc_date, item.spravochnik_organization_name, item.schet, item.prixod_sum.toFixed(2), item.rasxod_sum.toFixed(2), `${operatsii}`]);
      })
      sheetData.push([`Итого по счоту: ${object.schet}`,' ', ' ', ' ', `${object.prixod_sum}`, `${object.rasxod_sum}`])
    }
    sheetData.push(['Всего', ' ', ' ', ' ', data.prixod_sum.toFixed(2), data.rasxod_sum.toFixed(2)]);
    sheetData.push([`Остаток концу дня: ${data.balance_to.toFixed(2)}`]); 
    const workSheet = XLSX.utils.aoa_to_sheet(sheetData);
    workSheet['!cols'] = [
      { wch: 50 },
      { wch: 20 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Hisobot');
    const filePath = path.join(__dirname, '../../../public/uploads/' + fileName);
    XLSX.writeFile(workBook, filePath);
    return res.download(filePath, (err) => {
      if (err) {
        throw new ErrorResponse(err, err.statusCode);
      }
    });
  } catch (error) {
    errorCatch(error, res);
  }
};

module.exports = {
  getAllBankMonitoring,
  capExcelCreate,
  dailyExcelCreate
};