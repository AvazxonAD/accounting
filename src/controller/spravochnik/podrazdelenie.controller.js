const {
  getByAllPodrazdelenie,
  createPodrazdelenie,
  getAllPodrazdelenie,
  getTotalPodrazlanie,
  getByIdPodrazlanie,
  updatePodrazlanie,
  deletePodrazlanie,
} = require("../../service/spravochnik/podrazdelenie.service");
const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { podrazdelenieValidation } = require("../../helpers/validation/spravochnik/porazdelenie.validation");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { queryValidation } = require("../../helpers/validation/other/query.validation");
const { errorCatch } = require('../../helpers/errorCatch')

// create
const create = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const data = validationResponse(podrazdelenieValidation, req.body)
    await getByAllPodrazdelenie(region_id, data.name, data.rayon);
    const result = await createPodrazdelenie(user_id, data.name, data.rayon);
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getAll = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit } = validationResponse(queryValidation, req.body)
    const offset = (page - 1) * limit;
    const result = await getAllPodrazdelenie(region_id, offset, limit);
    const total = parseInt(totalQuery.total);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    }
    resFunc(res, 200, result.data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// update
const update = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdPodrazlanie(region_id, id);
    const { error, value } = podrazdelenieValidation.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    const { name, rayon } = value;
    if (podrazdelenie.name !== name || podrazdelenie.rayon !== rayon) {
      const test = await getByAllPodrazdelenie(region_id, name, rayon);
      if (test) {
        return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
      }
    }
    const result = await updatePodrazlanie(id, name, rayon);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deleteValue = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
  
    const value = await getByIdPodrazlanie(region_id, id);
    if (!value) {
      return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
    }
  
    await deletePodrazlanie(id);
  
    return res.status(200).json({
      success: true,
      data: "Muvaffaqiyatli ochirildi",
    });
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getElementById = async (req, res, next) => {
  try {
    const user_id = req.user.region_id;
    const id = req.params.id;
  
    const value = await getByIdPodrazlanie(user_id, id, true);
    if (!value) {
      return next(
        new ErrorResponse("Server error. spravochnik_podrazdelenie topilmadi"),
      );
    }
  
    return res.status(200).json({
      success: true,
      data: value,
    });
  } catch (error) {
    errorCatch(error, res)
  }
}

// import to excel
const importToExcel = async (req, res, next) => {
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
      `SELECT * FROM spravochnik_podrazdelenie WHERE user_id = $1 AND name = $2 AND rayon = $3 AND isdeleted = false`,
      [req.user.region_id, name, rayon],
    );
    if (test.rows[0]) {
      return next(new ErrorResponse(`Ushbu malumot kiritilgan: ${name}`, 400));
    }
  }

  for (let rowData of data) {
    const result = await pool.query(
      `INSERT INTO spravochnik_podrazdelenie(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
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
}

module.exports = {
  getElementById,
  create,
  getAll,
  deleteValue,
  update,
  importToExcel,
};
