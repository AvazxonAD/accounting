const {
  getByAlltype_operatsii,
  createtype_operatsii,
  getAlltype_operatsii,
  getTotaltype_operatsii,
  getByIdtype_operatsii,
  updatetype_operatsii,
} = require("../../service/spravochnik/type_operatsii.service");
const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { typeOperatsiiValidation } = require("../../helpers/validation/spravochnik/type_operatsii.validation");
const { deletetype_operatsii } = require("../../service/spravochnik/type_operatsii.service");
const { validationResponse } = require("../../helpers/response-for-validation");
const { errorCatch } = require("../../helpers/errorCatch");
const { resFunc } = require("../../helpers/resFunc");

// create
const create = async (req, res, next) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const data = validationResponse(typeOperatsiiValidation, req.body)
  const { name, rayon } = data;
  await getByAlltype_operatsii(region_id, name, rayon);
  const result = await createtype_operatsii(user_id, name, rayon);
  resFunc(res, 200, result)
}

// get all
const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const region_id = req.user.region_id;
  
    if (limit <= 0 || page <= 0) {
      return next(
        new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
      );
    }
  
    const offset = (page - 1) * limit;
  
    const result = await getAlltype_operatsii(region_id, offset, limit);
  
    const totalQuery = await getTotaltype_operatsii(region_id);
    const total = parseInt(totalQuery.total);
    const pageCount = Math.ceil(total / limit);
  
    return res.status(200).json({
      success: true,
      meta: {
        pageCount: pageCount,
        count: total,
        currentPage: page,
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
      },
      data: result,
    });
  } catch (error) {
    errorCatch(error, res)
  }
}

// update
const update = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
  
    const type_operatsii = await getByIdtype_operatsii(region_id, id);
    if (!type_operatsii) {
      return next(new ErrorResponse("Server xatolik. Sostav topilmadi", 404));
    }
  
    const { error, value } = typeOperatsiiValidation.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }
    const { name, rayon } = value;
  
    if (type_operatsii.name !== name || type_operatsii.rayon !== rayon) {
      const test = await getByAlltype_operatsii(region_id, name, rayon);
      if (test) {
        return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
      }
    }
  
    await updatetype_operatsii(id, name, rayon);
  
    return res.status(201).json({
      success: true,
      data: "Muvafaqyatli yangilandi",
    });
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deleteValue = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
  
    const value = await getByIdtype_operatsii(region_id, id);
    if (!value) {
      return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
    }
  
    await deletetype_operatsii(id);
  
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
    const value = await getByIdtype_operatsii(req.user.region_id, req.params.id, true);
    if (!value) {
      return next(
        new ErrorResponse("Server error. spravochnik_type_operatsii topilmadi"),
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
      `SELECT * FROM spravochnik_type_operatsii WHERE region_id = $1 AND name = $2 AND rayon = $3 AND isdeleted = false`,
      [req.user.region_id, name, rayon],
    );
    if (test.rows[0]) {
      return next(new ErrorResponse(`Ushbu malumot kiritilgan: ${name}`, 400));
    }
  }

  for (let rowData of data) {
    const result = await pool.query(
      `INSERT INTO spravochnik_type_operatsii(name, rayon, region_id) VALUES($1, $2, $3) RETURNING *
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
