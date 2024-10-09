const {
  getByInnOrganizationService,
  createOrganizationService,
  getAllOrganizationService,
  getByIdOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
} = require("../../service/spravochnik/organization.service");
const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require("xlsx");
const { organizationValidation, queryValidation } = require("../../helpers/validation/spravochnik/organization.validation");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { errorCatch } = require("../../helpers/errorCatch");

// createOrganization
const createOrganization = async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = validationResponse(organizationValidation, req.body)
    const result = await createOrganizationService({ ...data, user_id });
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getOrganization = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit, inn } = validationResponse(queryValidation, req.query)
    const offset = (page - 1) * limit;
    const { result, total } = await getAllOrganizationService(region_id, offset, limit, inn);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    }
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// updateOrganization
const updateOrganization = async (req, res) => {
  try {

  } catch (error) {
    errorCatch(error, res)
  }
  const id = req.params.id;
  const region_id = req.user.region_id;

  const partner = await getByIdOrganizationService(region_id, id);
  if (!partner) {
    return next(new ErrorResponse("Server xatolik. Hamkor topilmadi", 500));
  }

  const { error, value } = organizationValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  if (partner.inn !== value.inn) {
    const test = await getByInnOrganizationService(value.inn, region_id);
    if (test) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  await updateOrganizationService({ ...value, id });

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
}

// delete value
const deleteOrganization = async (req, res) => {
  try {

  } catch (error) {
    errorCatch(error, res)
  }
  const id = req.params.id;
  const region_id = req.user.region_id;
  const value = await getByIdOrganizationService(region_id, id);
  if (!value) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  await deleteOrganizationService(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
}

// get element by id
const getByIdOrganization = async (req, res) => {
  try {

  } catch (error) {
    errorCatch(error, res)
  }
  const value = await getByIdOrganizationService(req.user.region_id, req.params.id, true);
  if (!value) {
    return next(
      new ErrorResponse("Server error. spravochnik_organization topilmadi"),
    );
  }

  return res.status(200).json({
    success: true,
    data: value,
  });
}

// import excel
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
}

module.exports = {
  getByIdOrganization,
  createOrganization,
  getOrganization,
  deleteOrganization,
  updateOrganization,
  importToExcel,
};
