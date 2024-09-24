const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  checkValueString,
  checkValueNumber,
} = require("../../utils/check.functions");
const { sum } = require("../../utils/need.functions");

// create
const create = asyncHandler(async (req, res, next) => {
  let { smeta_id, spravochnik_budjet_name_id, year } = req.body;

  checkValueNumber(smeta_id, spravochnik_budjet_name_id, year);

  const smeta = await pool.query(
    `SELECT * FROM smeta WHERE id = $1 AND isdeleted = false`,
    [smeta_id],
  );
  if (!smeta.rows[0]) {
    return next(new ErrorResponse("Server xatolik smeta topilmadi", 500));
  }

  const budjet = await pool.query(
    `SELECT * FROM spravochnik_budjet_name WHERE id = $1 AND isdeleted = false`,
    [spravochnik_budjet_name_id],
  );
  if (!budjet.rows[0]) {
    return next(new ErrorResponse("Server xatolik budjet topilmadi", 500));
  }

  const test = await pool.query(
    `SELECT * FROM smeta_grafik 
        WHERE smeta_id = $1 AND spravochnik_budjet_name_id = $2 AND isdeleted = false AND user_id = $3 AND year = $4
    `,
    [smeta_id, spravochnik_budjet_name_id, req.user.region_id, year],
  );
  if (test.rows.length > 0) {
    return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
  }

  const result = await pool.query(
    `INSERT INTO smeta_grafik(smeta_id, spravochnik_budjet_name_id, user_id, year) VALUES($1, $2, $3, $4) RETURNING *
    `,
    [smeta_id, spravochnik_budjet_name_id, req.user.region_id, year],
  );
  if (!result.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT 
            smeta_grafik.id, 
            smeta_grafik.smeta_id, 
            smeta.smeta_name,
            smeta_grafik.spravochnik_budjet_name_id,
            spravochnik_budjet_name.name AS budjet_name,
            smeta_grafik.itogo,
            smeta_grafik.oy_1,
            smeta_grafik.oy_2,
            smeta_grafik.oy_3,
            smeta_grafik.oy_4,
            smeta_grafik.oy_5,
            smeta_grafik.oy_6,
            smeta_grafik.oy_7,
            smeta_grafik.oy_8,
            smeta_grafik.oy_9,
            smeta_grafik.oy_10,
            smeta_grafik.oy_11,
            smeta_grafik.oy_12,
            smeta_grafik.year
        FROM smeta_grafik  
        JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = smeta_grafik.spravochnik_budjet_name_id
        JOIN smeta ON smeta.id = smeta_grafik.smeta_id
        WHERE smeta_grafik.isdeleted = false AND smeta_grafik.user_id = $1
        OFFSET $2
        LIMIT $3
    `,
    [req.user.region_id, offset, limit],
  );

  const formattedResult = result.rows.map((row) => ({
    ...row,
    itogo: parseFloat(row.itogo),
    oy_1: parseFloat(row.oy_1),
    oy_2: parseFloat(row.oy_2),
    oy_3: parseFloat(row.oy_3),
    oy_4: parseFloat(row.oy_4),
    oy_5: parseFloat(row.oy_5),
    oy_6: parseFloat(row.oy_6),
    oy_7: parseFloat(row.oy_7),
    oy_8: parseFloat(row.oy_8),
    oy_9: parseFloat(row.oy_9),
    oy_10: parseFloat(row.oy_10),
    oy_11: parseFloat(row.oy_11),
    oy_12: parseFloat(row.oy_12),
    year: parseInt(row.year),
  }));

  const totalQuery = await pool.query(
    `SELECT COUNT(id) AS total FROM smeta WHERE isdeleted = false`,
  );
  const total = parseInt(totalQuery.rows[0].total);
  const pageCount = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    pageCount: pageCount,
    count: total,
    currentPage: page,
    nextPage: page >= pageCount ? null : page + 1,
    backPage: page === 1 ? null : page - 1,
    data: formattedResult,
  });
});

// get elament by id
const getElemnetById = asyncHandler(async (req, res, next) => {
  const result = await pool.query(
    `SELECT 
            smeta_grafik.id, 
            smeta_grafik.smeta_id, 
            smeta.smeta_name,
            smeta_grafik.spravochnik_budjet_name_id,
            spravochnik_budjet_name.name AS budjet_name,
            smeta_grafik.itogo,
            smeta_grafik.oy_1,
            smeta_grafik.oy_2,
            smeta_grafik.oy_3,
            smeta_grafik.oy_4,
            smeta_grafik.oy_5,
            smeta_grafik.oy_6,
            smeta_grafik.oy_7,
            smeta_grafik.oy_8,
            smeta_grafik.oy_9,
            smeta_grafik.oy_10,
            smeta_grafik.oy_11,
            smeta_grafik.oy_12,
            smeta_grafik.year
        FROM smeta_grafik  
        JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = smeta_grafik.spravochnik_budjet_name_id
        JOIN smeta ON smeta.id = smeta_grafik.smeta_id
        WHERE smeta_grafik.isdeleted = false AND smeta_grafik.user_id = $1 AND smeta_grafik.id = $2
    `,
    [req.user.region_id, req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new ErrorResponse("Server xatoilik. Grafik topilmadi", 500));
  }

  const formattedResult = result.rows.map((row) => ({
    ...row,
    itogo: parseFloat(row.itogo),
    oy_1: parseFloat(row.oy_1),
    oy_2: parseFloat(row.oy_2),
    oy_3: parseFloat(row.oy_3),
    oy_4: parseFloat(row.oy_4),
    oy_5: parseFloat(row.oy_5),
    oy_6: parseFloat(row.oy_6),
    oy_7: parseFloat(row.oy_7),
    oy_8: parseFloat(row.oy_8),
    oy_9: parseFloat(row.oy_9),
    oy_10: parseFloat(row.oy_10),
    oy_11: parseFloat(row.oy_11),
    oy_12: parseFloat(row.oy_12),
    year: parseInt(row.year),
  }));

  return res.status(200).json({
    success: true,
    data: formattedResult[0],
  });
});

// update
const update = asyncHandler(async (req, res, next) => {
  let value = await pool.query(
    `SELECT * FROM smeta_grafik 
        WHERE user_id = $1 AND id = $2 AND isdeleted = false
    `,
    [req.user.region_id, req.params.id],
  );
  value = value.rows[0];
  if (!value) {
    return next(new ErrorResponse("Server xatolik. Grafik topilmadi", 500));
  }

  let {
    smeta_id,
    spravochnik_budjet_name_id,
    itogo,
    oy_1,
    oy_2,
    oy_3,
    oy_4,
    oy_5,
    oy_6,
    oy_7,
    oy_8,
    oy_9,
    oy_10,
    oy_11,
    oy_12,
    year,
  } = req.body;

  checkValueNumber(
    smeta_id,
    spravochnik_budjet_name_id,
    itogo,
    oy_1,
    oy_2,
    oy_3,
    oy_4,
    oy_5,
    oy_6,
    oy_7,
    oy_8,
    oy_9,
    oy_10,
    oy_11,
    oy_12,
    year,
  );

  const smeta = await pool.query(
    `SELECT * FROM smeta WHERE id = $1 AND isdeleted = false`,
    [smeta_id],
  );
  if (!smeta.rows[0]) {
    return next(new ErrorResponse("Server xatolik smeta topilmadi", 500));
  }

  const budjet = await pool.query(
    `SELECT * FROM spravochnik_budjet_name WHERE id = $1 AND isdeleted = false`,
    [spravochnik_budjet_name_id],
  );
  if (!budjet.rows[0]) {
    return next(new ErrorResponse("Server xatolik budjet topilmadi", 500));
  }

  if (value.year !== year) {
    const test = await pool.query(
      `SELECT * FROM smeta_grafik 
            WHERE smeta_id = $1 AND spravochnik_budjet_name_id = $2 AND isdeleted = false AND user_id = $3 AND year = $4
        `,
      [smeta_id, spravochnik_budjet_name_id, req.user.region_id, year],
    );
    if (test.rows.length > 0) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }
  if (
    Number(itogo) !==
    sum(
      oy_1,
      oy_2,
      oy_3,
      oy_4,
      oy_5,
      oy_6,
      oy_7,
      oy_8,
      oy_9,
      oy_10,
      oy_11,
      oy_12,
    )
  ) {
    return next(
      new ErrorResponse(
        "Server xatolik. Itogo va oylar summa yig`indisi teng bolishi kerak",
        400,
      ),
    );
  }

  const result = await pool.query(
    `UPDATE  smeta_grafik 
        SET 
            smeta_id = $1, 
            spravochnik_budjet_name_id = $2, 
            itogo = $3,
            oy_1 = $4,
            oy_2 = $5,
            oy_3 = $6,
            oy_4 = $7,
            oy_5 = $8,
            oy_6 = $9,
            oy_7 = $10,
            oy_8 = $11,
            oy_9 = $12,
            oy_10 = $13,
            oy_11 = $14,
            oy_12 = $15,
            year = $16
        WHERE  id = $17
        RETURNING *
    `,
    [
      smeta_id,
      spravochnik_budjet_name_id,
      itogo,
      oy_1,
      oy_2,
      oy_3,
      oy_4,
      oy_5,
      oy_6,
      oy_7,
      oy_8,
      oy_9,
      oy_10,
      oy_11,
      oy_12,
      year,
      value.id,
    ],
  );
  if (!result.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Malumot Yangilanmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  let value = await pool.query(
    `SELECT * FROM smeta_grafik WHERE id = $1 AND isdeleted = false AND user_id = $2
    `,
    [req.params.id, req.user.region_id],
  );
  value = value.rows[0];
  if (!value) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  const deleteValue = await pool.query(
    `UPDATE smeta_grafik SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, req.params.id],
  );

  if (!deleteValue.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

module.exports = {
  create,
  getAll,
  deleteValue,
  update,
  getElemnetById,
};
