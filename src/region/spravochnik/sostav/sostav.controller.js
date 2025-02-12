const {
  getSostavService,
  getByAllSostavService,
  createSostavService,
  getByIdSostavService,
  updateSostavService,
  deleteSostavService,
} = require("./sostav.service");
const pool = require("@config/db");
const ErrorResponse = require("@utils/errorResponse");
const xlsx = require("xlsx");
const { sostavValidation } = require("@utils/validation");;
const { validationResponse } = require("@utils/response-for-validation");
const { resFunc } = require("@utils/resFunc");
const { queryValidation } = require("@utils/validation");;
const { errorCatch } = require("@utils/errorCatch");

// createSostav
const createSostav = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const {name, rayon} = validationResponse(sostavValidation, req.body)
    await getByAllSostavService(region_id, name, rayon);
    const result = await createSostavService(user_id, name, rayon);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getSostav = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const {limit, page, search} = validationResponse(queryValidation, req.query)
    const offset = (page - 1) * limit;
    const result = await getSostavService(region_id, offset, limit, search);
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
  } catch (error) {
    errorCatch(error, res)
  }
}

// updateSostav
const updateSostav = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    let sostav = await getByIdSostavService(region_id, id);
    const { name, rayon} = validationResponse(sostavValidation, req.body)
    if (sostav.name !== name || sostav.rayon !== rayon) {
      await getByAllSostavService(region_id, name, rayon);
    }
    const result = await updateSostavService(id, name, rayon);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deleteSostav = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdSostavService(region_id, id);
    await deleteSostavService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getById = async (req, res) => {
  try {
    const data = await getByIdSostavService(req.user.region_id, req.params.id, true);
    resFunc(res, 200, data)
  } catch (error) {
    errorCatch(error, res)
  }
}

// import to excel
const importToExcel = async (req, res) => {
  if (!req.file) {
    return new ErrorResponse("Fayl yuklanmadi", 400)
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
      return new ErrorResponse(`Ushbu malumot kiritilgan: ${name}`, 400)
    }
  }

  for (let rowData of data) {
    const result = await pool.query(
      `INSERT INTO spravochnik_sostav(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
        `,
      [rowData.name, rowData.rayon, req.user.region_id],
    );
    if (!result.rows[0]) {
        new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500)
    }
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
}

module.exports = {
  getById,
  createSostav,
  getSostav,
  deleteSostav,
  updateSostav,
  importToExcel,
};
