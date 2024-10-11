const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { podotchetLitsoValidation } = require("../../helpers/validation/spravochnik/podotchet.litso.validation");
const { errorCatch } = require('../../helpers/errorCatch')
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { queryValidation } = require('../../helpers/validation/other/query.validation')

const {
  createPodotChetService,
  updatePodotchetService,
  deletePodotchetService,
  getByAllPodotChetService,
  getAllPodotChetService,
  getByIdPodotchetService,
} = require("../../service/spravochnik/podotchet.litso.service");

// createPodotchetLitso
const createPodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const data = validationResponse(podotchetLitsoValidation, req.body)
    await getByAllPodotChetService(data.name, data.rayon, region_id);
    const result = await createPodotChetService({ ...data, user_id });
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }

}

// get all
const getPodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id
    const { page, limit } = validationResponse(queryValidation, req.query)
    const offset = (page - 1) * limit;
    const result = await getAllPodotChetService(region_id, offset, limit);
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

// updatePodotchetLitso
const updatePodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const podotchet_litso = await getByIdPodotchetService(region_id, id);  
    const data = validationResponse(podotchetLitsoValidation, req.body)
    if ( podotchet_litso.name !== data.name || podotchet_litso.rayon !== data.rayon) {
      await getByAllPodotChetService(data.name, data.rayon, region_id);
    }
    const result = await updatePodotchetService({ ...data, id });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deletePodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdPodotchetService(region_id, id);
    await deletePodotchetService(id);
    resFunc(res, 200, 'Delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdPodotchetLitso = async (req, res, next) => {
  try {
    const result = await getByIdPodotchetService(req.user.region_id, req.params.id, true);
    resFunc(res, 200, result)
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
      `SELECT * FROM spravochnik_podotchet_litso WHERE user_id = $1 AND name = $2 AND rayon = $3 AND isdeleted = false`,
      [req.user.region_id, name, rayon],
    );
    if (test.rows[0]) {
      return next(new ErrorResponse(`Ushbu malumot kiritilgan: ${name}`, 400));
    }
  }

  for (let rowData of data) {
    const result = await pool.query(
      `INSERT INTO spravochnik_podotchet_litso(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
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
  getByIdPodotchetLitso,
  createPodotchetLitso,
  getPodotchetLitso,
  deletePodotchetLitso,
  updatePodotchetLitso,
  importToExcel,
};
