const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  checkValueString,
  checkValueNumber,
} = require("../../utils/check.functions");
const { getByIdSmeta } = require("../../service/smeta/smeta.db");
const { getByIdOrganization } = require("../../service//spravochnik/organization.db");
const {
  createShartnoma,
  getAllShartnoma,
  getTotalShartnoma,
  updateShartnoma,
  getByIdShartnoma,
} = require("../../service/shartnoma/shartnoma.db");
const { createGrafik } = require("../../service/shartnoma/shartnoma.grafik.db");

const create = asyncHandler(async (req, res, next) => {
  let {
    doc_num,
    doc_date,
    summa,
    opisanie,
    smeta_id,
    smeta_2,
    spravochnik_organization_id,
  } = req.body;
  const user_id = req.user.region_id;

  checkValueString(doc_num, doc_date, opisanie, smeta_2);
  checkValueNumber(summa, spravochnik_organization_id);

  const test_smeta = await getByIdSmeta(smeta_id);
  if (!test_smeta) {
    return next(new ErrorResponse("Smeta topilmadi", 500));
  }

  const test_organization = await getByIdOrganization(
    user_id,
    spravochnik_organization_id,
  );
  if (!test_organization) {
    return next(new ErrorResponse("Hamkor topilmadi", 500));
  }

  const shartnoma = await createShartnoma(
    user_id,
    doc_num,
    doc_date,
    summa,
    opisanie,
    smeta_id,
    smeta_2,
    spravochnik_organization_id,
  );
  if (!shartnoma) {
    return next(new ErrorResponse("Malumot kiritilmadi", 500));
  }

  const grafik = await createGrafik(user_id, shartnoma.id);
  if (!grafik) {
    return next(new ErrorResponse("Server xatoloik. Grafik yaratilmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqiyatli kiritildi",
  });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const user_id = req.user.region_id;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  const result = await getAllShartnoma(user_id, offset, limit);
  const totalQuery = await getTotalShartnoma(user_id);
  const total = parseInt(totalQuery.total);
  const pageCount = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    pageCount: pageCount,
    count: total,
    currentPage: page,
    nextPage: page >= pageCount ? null : page + 1,
    backPage: page === 1 ? null : page - 1,
    data: result,
  });
});

// update shartnoma
const update_shartnoma = asyncHandler(async (req, res, next) => {
  const user_id = req.user.region_id;
  const id = req.params.id;

  const shartnoma = await getByIdShartnoma(user_id, id);
  if (!shartnoma) {
    return next(new ErrorResponse("Server xatolik. Shartnoma topilmadi", 500));
  }

  let {
    doc_num,
    doc_date,
    summa,
    opisanie,
    smeta_id,
    smeta_2,
    spravochnik_organization_id,
  } = req.body;

  checkValueString(doc_num, doc_date, opisanie, smeta_2);
  checkValueNumber(summa, spravochnik_organization_id);

  const test_smeta = await pool.query(
    `SELECT * FROM smeta WHERE id = $1 AND isdeleted = false`,
    [smeta_id],
  );
  if (!test_smeta.rows[0]) {
    return next(new ErrorResponse("Smeta topilmadi", 500));
  }

  const test_organization = await pool.query(
    `SELECT * FROM spravochnik_organization WHERE id = $1 AND isdeleted = false AND user_id = $2`,
    [spravochnik_organization_id, user_id],
  );

  if (!test_organization.rows[0]) {
    return next(new ErrorResponse("Hamkor topilmadi", 500));
  }

  const result = await updateShartnoma(
    id,
    doc_num,
    doc_date,
    summa,
    opisanie,
    smeta_id,
    smeta_2,
    spravochnik_organization_id,
  );
  if (!result) {
    return next(new ErrorResponse("Malumot yangilanmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqiyatli kiritildi",
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ErrorResponse("Server xatolik. ID topilmadi", 404));
  }

  const result = await pool.query(
    `
        SELECT 
            shartnomalar_organization.id, 
            shartnomalar_organization.doc_num, 
            shartnomalar_organization.doc_date, 
            shartnomalar_organization.summa,
            shartnomalar_organization.opisanie,
            shartnomalar_organization.smeta_id,
            shartnomalar_organization.smeta_2,
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM 
            shartnomalar_organization
        JOIN 
            smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN 
            spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE 
            shartnomalar_organization.isdeleted = false 
            AND shartnomalar_organization.user_id = $1
            AND shartnomalar_organization.id = $2
    `,
    [req.user.region_id, id],
  );

  return res.status(200).json({
    success: true,
    data: result.rows[0],
  });
});

// delete shartnoma
exports.deleteShartnoma = asyncHandler(async (req, res, next) => {
  const shartnoma = await pool.query(
    `SELECT * FROM shartnomalar_organization WHERE id = $1 AND user_id = $2 AND isdeleted = false
    `,
    [req.params.id, req.user.region_id],
  );
  if (!shartnoma.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Shartnoma topilmadi", 404));
  }
});

module.exports = {
  create,
  getAll,
  getElementById,
  update_shartnoma,
};
