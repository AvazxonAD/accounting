const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { getAllMonitoring } = require("../../service/bank/bank.monitoring.service");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.service");
const { getLogger } = require('../../helpers/log_functions/logger')
const { validationResponse } = require('../../helpers/response-for-validation')

const getAllBankMonitoring = asyncHandler(async (req, res, next) => {
  const data = validationResponse(queryValidation, req.query)
  const region_id = req.user.region_id;
  const limit = parseInt(data.limit) || 10;
  const page = parseInt(data.page) || 1;
  const main_schet_id = data.main_schet_id;
  const from = data.from;
  const to = data.to;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;
  const main_schet = await getByIdMainSchet(region_id, data.main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Schet topilmadi", 404));
  }

  const result = await getAllMonitoring(
    region_id,
    main_schet_id,
    offset,
    limit,
    from,
    to,
  );
  const total = Number(result.total_count);
  const prixod_sum = Number(result.all_prixod_sum);
  const rasxod_sum = Number(result.all_rasxod_sum);
  const summaFrom = Number(result.total_sum_from);
  const summaTo = Number(result.total_sum_to);
  const pageCount = Math.ceil(total / limit);

  getLogger.info(`Muvaffaqiyatli bank monitoring doclar olindi. UserId: ${req.user.id}`)
  return res.status(200).json({
    success: true,
    meta: {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      prixod_sum,
      rasxod_sum,
      summaFrom,
      summaTo,
    },
    data: result.result_data,
  });
});

module.exports = {
  getAllBankMonitoring
};
