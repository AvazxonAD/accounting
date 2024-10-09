const {
  getByAlltypeOperatsiiService,
  createTypeOperatsiiService,
  getAlltypeOperatsiiService,
  getByIdTypeOperatsiiService,
  updatetypeOperatsiiService,
} = require("../../service/spravochnik/type_operatsii.service");
const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { typeOperatsiiValidation } = require("../../helpers/validation/spravochnik/type_operatsii.validation");
const { deletetypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { validationResponse } = require("../../helpers/response-for-validation");
const { errorCatch } = require("../../helpers/errorCatch");
const { resFunc } = require("../../helpers/resFunc");

// createTypeOperatsii
const createTypeOperatsii = async (req, res) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const data = validationResponse(typeOperatsiiValidation, req.body)
  const { name, rayon } = data;
  await getByAlltypeOperatsiiService(region_id, name, rayon);
  const result = await createTypeOperatsiiService(user_id, name, rayon);
  resFunc(res, 200, result)
}

// get all
const getTypeOperatsii = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const region_id = req.user.region_id;
  
    if (limit <= 0 || page <= 0) {
      throw new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400)
    }
    const offset = (page - 1) * limit;
    const result = await getAlltypeOperatsiiService(region_id, offset, limit);
    const total = parseInt(result.total_count);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    }
    resFunc(res, 200, result?.data || [], meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// updateTypeOperatsii
const updateTypeOperatsii = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const type_operatsii = await getByIdTypeOperatsiiService(region_id, id);
    const data = validationResponse(typeOperatsiiValidation, req.body);
    const { name, rayon } = data;  
    if (type_operatsii.name !== name || type_operatsii.rayon !== rayon) {
      const test = await getByAlltypeOperatsiiService(region_id, name, rayon);
      if (test) {
        throw new ErrorResponse("This information has already been entered", 409)
      }
    }
    const result = await updatetypeOperatsiiService(id, name, rayon);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deleteTypeOperatsii = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdTypeOperatsiiService(region_id, id);
    await deletetypeOperatsiiService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdTypeOperatsii = async (req, res) => {
  try {
    const result = await getByIdTypeOperatsiiService(req.user.region_id, req.params.id, true);
    resFunc(res, 200, result)
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
  getByIdTypeOperatsii,
  createTypeOperatsii,
  getTypeOperatsii,
  deleteTypeOperatsii,
  updateTypeOperatsii,
  importToExcel,
};
