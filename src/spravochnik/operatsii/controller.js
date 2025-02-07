const {
  createOperatsiiService,
  getAllOperatsiiService,
  updateOperatsiiService,
  deleteOperatsiiService,
  getByIdOperatsiiService,
  getSchetService,
  ForFilterService
} = require("./operatsii.service");
const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { operatsiiValidation, operatsiiQueryValidation } = require("../../utils/validation");;
const { SmetaDB } = require("../../smeta/smeta/db");
const { errorCatch } = require('../../utils/errorCatch')
const { resFunc } = require("../../utils/resFunc");
const { validationResponse } = require("../../utils/response-for-validation");
const { OperatsiiService } = require('./service');

const Controller = class {
  static async uniqueSchets(req, res) {
    const { type_schet } = req.query;
    const result = await OperatsiiService.uniqueSchets({ type_schet });

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }
}


const getSchet = async (req, res) => {
  try {
    const result = await getSchetService()
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// createOperatsii
const createOperatsii = async (req, res) => {
  try {
    const data = validationResponse(operatsiiValidation, req.body)
    const smeta = await SmetaDB.getById([data.smeta_id]);
    if (!smeta) {
      return res.status(404).json({
        message: "smeta not found"
      })
    };
    const result = await createOperatsiiService({ ...data });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getOperatsii = async (req, res) => {
  try {
    const { page, limit, type_schet, search, meta_search, schet, sub_schet } = validationResponse(operatsiiQueryValidation, req.query)
    const offset = (page - 1) * limit;
    const { result, total } = await getAllOperatsiiService(offset, limit, type_schet, search, meta_search, schet, sub_schet);
    const pageCount = Math.ceil(total / limit)
    const meta = {
      pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    }
    resFunc(res, 200, result, meta)
  } catch (error) {
    return errorCatch(error, res)
  }
}

// updateOperatsii
const updateOperatsii = async (req, res) => {
  try {
    const id = req.params.id;
    await getByIdOperatsiiService(id, null);
    const data = validationResponse(operatsiiValidation, req.body)
    const smeta = await SmetaDB.getById([data.smeta_id]);
    if (!smeta) {
      return res.status(404).json({
        message: "smeta not found"
      })
    };
    const result = await updateOperatsiiService({ ...data, id });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deleteOperatsii = async (req, res) => {
  try {
    const id = req.params.id;
    await getByIdOperatsiiService(id, null);
    await deleteOperatsiiService(id);
    return resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdOperatsii = async (req, res) => {
  try {
    const result = await getByIdOperatsiiService(req.params.id, null, true);
    return resFunc(res, 200, result);
  } catch (error) {
    errorCatch(error, res)
  }
}

// import to excel
const importToExcel = async (req, res) => {
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
}

module.exports = {
  getByIdOperatsii,
  createOperatsii,
  getOperatsii,
  deleteOperatsii,
  updateOperatsii,
  importToExcel,
  getSchet,
  Controller
};
