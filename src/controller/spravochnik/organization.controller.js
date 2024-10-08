const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const {
  getByInnOrganization,
  createOrganization,
  getAllOrganization,
  totalOrganization,
  getByIdOrganization,
  updateOrganization,
  deleteOrganization,
} = require("../../service/spravochnik/organization.service");

const {
  organizationValidation,
} = require("../../helpers/validation/spravochnik/organization.validation");
// create
const create = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const { error, value } = organizationValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }
  await createOrganization({ ...value, user_id });

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  let result = null;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  let inn = null;
  let totalQuery = null;
  const region_id = req.user.region_id;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  if (inn) {
    result = await getByInnOrganization(inn, region_id);
    totalQuery = { total: 1 };
  }

  if (!inn) {
    result = await getAllOrganization(region_id, offset, limit);
    totalQuery = await totalOrganization(region_id);
  }

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
});

// update
const update = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const region_id = req.user.region_id;

  const partner = await getByIdOrganization(region_id, id);
  if (!partner) {
    return next(new ErrorResponse("Server xatolik. Hamkor topilmadi", 500));
  }

  const { error, value } = organizationValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  if (partner.inn !== value.inn) {
    const test = await getByInnOrganization(value.inn, region_id);
    if (test) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  await updateOrganization({ ...value, id });

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const region_id = req.user.region_id;
  const value = await getByIdOrganization(region_id, id);
  if (!value) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  await deleteOrganization(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const value = await getByIdOrganization(req.user.region_id, req.params.id, true);
  if (!value) {
    return next(
      new ErrorResponse("Server error. spravochnik_organization topilmadi"),
    );
  }

  return res.status(200).json({
    success: true,
    data: value,
  });
});

// import excel
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
      `SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2 AND isdeleted = false`,
      [rowData.inn, req.user.region_id],
    );
    if (test.rows.length > 0) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  for (let rowData of data) {
    const result = await pool.query(
      `INSERT INTO spravochnik_organization(
            name, bank_klient, raschet_schet, 
            raschet_schet_gazna, mfo, inn, user_id, okonx
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
      [
        rowData.name,
        rowData.bank_klient,
        rowData.raschet_schet,
        rowData.raschet_schet_gazna,
        rowData.mfo,
        rowData.inn,
        req.user.region_id,
        rowData.okonx,
      ],
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
