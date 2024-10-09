const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { sostavValidation } = require("../../helpers/validation/spravochnik/sostav.validation");
const {
  getSostavService,
  getByAllSostavService,
  createSostavService,
  getTotalSostav,
  getByIdSostav,
  updateSostav,
  deleteSostav,
} = require("../../service/spravochnik/sostav.service");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { queryValidation } = require("../../helpers/validation/other/query.validation");

// create
const create = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const {name, rayon} = validationResponse(sostavValidation, req.body)
  await getByAllSostavService(region_id, name, rayon);
  const result = await createSostavService(user_id, name, rayon);
  resFunc(res, 200, result)
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const {limit, page} = validationResponse(queryValidation, req.query)
  const offset = (page - 1) * limit;
  const result = await getSostavService(region_id, offset, limit);
  const total = result.total_count
  const pageCount = Math.ceil(total / limit);
  const meta = {
    pageCount: pageCount,
    count: total,
    currentPage: page,
    nextPage: page >= pageCount ? null : page + 1,
    backPage: page === 1 ? null : page - 1,
  }
  resFunc(res, 200, result?.data || [], meta)
});

// update
const update = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const id = req.params.id;
  let sostav = await getByIdSostav(region_id, id);
  const { name, rayon} = validationResponse(sostavValidation, req,body)
  if (sostav.name !== name || sostav.rayon !== rayon) {
    await getByAllSostavService(region_id, name, rayon);
  }
  const result = await updateSostav(id, name, rayon);
  resFunc(res, 200, result)
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const id = req.params.id;
  await getByIdSostav(region_id, id);
  await deleteSostav(id);
  resFunc(res, 200, 'delete success true')
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const data = await getByIdSostav(req.user.region_id, req.params.id, true);
  resFunc(res, 200, data)
});

// import to excel
const importToExcel = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse("Fayl yuklanmadi", 400));
  }

  const filePath = req.file.path;

  const workbook = xlsx.readFile(filePath);

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(sheet).map((row) => {
    const newRow = {};
    for (const key in row) {
      newRow[key.trim()] = row[key];
    }
    return newRow;
  });

  for (const rowData of data) {
    checkValueString(rowData.name, rowData.rayon);
    const name = rowData.name.trim();
    const rayon = rowData.rayon.trim();

    const test = await pool.query(
      `SELECT * FROM spravochnik_sostav WHERE user_id = $1 AND name = $2 AND rayon = $3 AND isdeleted = false`,
      [req.user.region_id, name, rayon],
    );
    if (test.rows[0]) {
      return next(new ErrorResponse(`Ushbu malumot kiritilgan: ${name}`, 400));
    }
  }

  for (let rowData of data) {
    const result = await pool.query(
      `INSERT INTO spravochnik_sostav(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
        `,
      [rowData.name, rowData.rayon, req.user.region_id],
    );
    if (!result.rows[0]) {
      return next(
        new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500),
      );
    }
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

module.exports = {
  getElementById,
  create,
  getAll,
  deleteValue,
  update,
  importToExcel,
};
