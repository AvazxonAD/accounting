const { getAllMonitoring } = require("../../service/bank/bank.monitoring.service");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getLogger } = require('../../helpers/log_functions/logger')
const { validationResponse } = require('../../helpers/response-for-validation');
const { errorCatch } = require("../../helpers/errorCatch");
const { resFunc } = require("../../helpers/resFunc");
const XLSX = require('xlsx')
const path = require('path')

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
    const workBook = XLSX.utils.book_new();
    const data = [
      [{ v: "Дневной отчет папка Ж.О. №2", s: { font: { bold: true } } }], 
      [{ v: "За период с 1-январь 2023 по 14-октябрь 2024", s: { font: { bold: true } } }], 
      [{ v: "Остаток к началу дня: 0.00", s: { font: { bold: true } } }], 
      ["Счет", "Приход", "Расход"], 
      ["120", 0, 9648390800],
      ["159", 1975060, 0],
    ];
    const fileName = `bank_shapka_${new Date().getTime()}`;
    const workSheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Hisobot');
    const filePath = path.join(__dirname, '../../../public/uploads/' + fileName); 
    XLSX.writeFile(workBook, filePath);
    res.download(filePath, 'hisobot.xlsx', (err) => {
      if (err) {
        console.error('Faylni yuklab olishda xatolik:', err);
        return res.status(500).send('Faylni yuklab olishda xatolik yuz berdi.');
      }
    });
  } catch (error) {
    errorCatch(error, res);
  }
};


module.exports = {
  getAllBankMonitoring,
  capExcelCreate
};
