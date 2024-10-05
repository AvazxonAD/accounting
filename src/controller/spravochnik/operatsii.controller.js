const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { operatsiiValidation } = require("../../helpers/validation/spravochnik/operatsii.validation");
const { getByIdSmeta } = require("../../service/smeta/smeta.service");
const { errorCatch } = require('../../helpers/errorCatch')
const {
  getByNameAndSchetOperatsii,
  createOperatsii,
  getAllOperatsiiService,
  getByIDOperatsii,
  updateOperatsii,
  deleteOperatsii,
} = require("../../service/spravochnik/operatsii.service");


// create
const create = asyncHandler(async (req, res, next) => {
  const { error, value } = operatsiiValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const smeta_test = await getByIdSmeta(value.smeta_id);
  if (!smeta_test) {
    return next(new ErrorResponse("Server xatolik. smeta topilmadi", 400));
  }
  const test = await getByNameAndSchetOperatsii(
    value.name,
    value.type_schet,
    value.smeta_id,
  );
  if (test) {
    return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
  }

  await createOperatsii({ ...value });

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all
const getAll = async (req, res, next) => {
  try {
    const query = req.query.type_schet;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    if (limit <= 0 || page <= 0) {
      return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;
    
    const result = await getAllOperatsiiService(query, offset, limit);

    const total = parseInt(result.total_count);
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
      data: result.data,
    });
  } catch (error) {
    return errorCatch(error, res)
  }
}

// update
const update = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const operatsii = await getByIDOperatsii(id);
  if (!operatsii) {
    return next(new ErrorResponse("Server xatolik. Operatsi topilmadi", 404));
  }

  const { error, value } = operatsiiValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const smeta_test = await getByIdSmeta(value.smeta_id);
  if (!smeta_test) {
    return next(new ErrorResponse("Server xatolik. smeta topilmadi", 400));
  }
  if (
    operatsii.name !== value.name ||
    operatsii.type_schet !== value.type_schet
  ) {
    const test = await getByNameAndSchetOperatsii(
      value.name,
      value.type_schet,
      value.smeta_id,
    );
    if (test) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  await updateOperatsii({ ...value, id });

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const value = await getByIDOperatsii(id);
  if (!value) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  await deleteOperatsii(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const value = await getByIDOperatsii(req.params.id, true);
  if (!value) {
    return next(
      new ErrorResponse("Server error. spravochnik_operatsii topilmadi"),
    );
  }

  return res.status(200).json({
    success: true,
    data: value,
  });
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
    const test = await pool.query(
      `SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false
        `,
      [rowData.name, rowData.type_schet],
    );
    if (test.rows.length > 0) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  for (let rowData of data) {
    const result = await pool.query(
      `INSERT INTO spravochnik_operatsii(
            name,  schet, sub_schet, type_schet
            ) VALUES($1, $2, $3, $4) 
            RETURNING *
        `,
      [rowData.name, rowData.schet, rowData.sub_schet, rowData.type_schet],
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
