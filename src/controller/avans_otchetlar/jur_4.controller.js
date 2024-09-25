const asyncHandler = require("../../middleware/asyncHandler");
const {
  checkValueString,
  checkValueNumber,
  checkValueBoolean,
  checkValueArray,
} = require("../../utils/check.functions");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require("../../config/db");

// jur 4 create
const jur_4_create = asyncHandler(async (req, res, next) => {
  const {
    doc_num,
    doc_date,
    summa,
    opisanie,
    spravochnik_podotchet_litso_id,
    childs
  } = req.body;

  checkValueString(doc_date, doc_num, opisanie);
  checkValueNumber(spravochnik_podotchet_litso_id, summa);
  checkValueArray(childs);

  const main_schet_id = req.query.main_schet_id;
  let main_schet = await pool.query(
    `SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [main_schet_id, req.user.region_id],
  );
  main_schet = main_schet.rows[0];
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  let podotchet_litso = await pool.query(
    `SELECT * FROM spravochnik_podotchet_litso WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [spravochnik_podotchet_litso_id, req.user.region_id],
  );
  podotchet_litso = podotchet_litso.rows[0];
  if (!podotchet_litso) {
    return next(new ErrorResponse("podotchet_litso topilmadi", 404));
  }

  for (let child of childs) {
    checkValueNumber(
      child.spravochnik_operatsii_id,
      child.summa,
      child.id_spravochnik_podrazdelenie,
      child.id_spravochnik_sostav,
      child.id_spravochnik_type_operatsii,
    );

    const spravochnik_operatsii = await pool.query(
      `SELECT * FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`,
      ["bank_prixod", child.spravochnik_operatsii_id],
    );
    if (!spravochnik_operatsii.rows[0]) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }

    const spravochnik_podrazdelenie = await pool.query(
      `SELECT * FROM spravochnik_podrazdelenie WHERE user_id = $1 AND isdeleted = false AND id = $2`,
      [req.user.region_id, child.id_spravochnik_podrazdelenie],
    );
    if (!spravochnik_podrazdelenie.rows[0]) {
      return next(
        new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
      );
    }

    const spravochnik_sostav = await pool.query(
      `SELECT * FROM spravochnik_sostav WHERE user_id = $1 AND isdeleted = false AND id = $2`,
      [req.user.region_id, child.id_spravochnik_sostav],
    );
    if (!spravochnik_sostav.rows[0]) {
      return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
    }

    const spravochnik_type_operatsii = await pool.query(
      `SELECT * FROM spravochnik_type_operatsii WHERE isdeleted = false AND id = $1 AND user_id = $2`,
      [child.id_spravochnik_type_operatsii, req.user.region_id],
    );
    if (!spravochnik_type_operatsii.rows[0]) {
      return next(
        new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
      );
    }
  }

  const result = await pool.query(
    `
        INSERT INTO avans_otchetlar_jur4(
            doc_num, 
            doc_date, 
            opisanie, 
            summa,
            spravochnik_podotchet_litso_id, 
            main_schet_id, 
            user_id
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
        `,
    [
      doc_num,
      doc_date,
      opisanie,
      summa,
      spravochnik_podotchet_litso_id,
      main_schet_id,
      req.user.region_id,
    ],
  );

  if (!result.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500));
  }

  for (let child of childs) {
    const result_child = await pool.query(
      `
            INSERT INTO avans_otchetlar_jur4_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                own_schet,
                own_subschet,
                main_schet_id,
                avans_otchetlar_jur4_id,
                user_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        child.spravochnik_operatsii_id,
        child.summa,
        child.id_spravochnik_podrazdelenie,
        child.id_spravochnik_sostav,
        child.id_spravochnik_type_operatsii,
        main_schet.jur2_schet,
        main_schet.jur2_subschet,
        main_schet.id,
        result.rows[0].id,
        req.user.region_id,
      ],
    );
    if (!result_child.rows[0]) {
      return next(
        new ErrorResponse("Server xatolik. Child yozuv kiritilmadi", 500),
      );
    }
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// jur 4 get all
const getAllJur_4 = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  let main_schet = await pool.query(
    `SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [main_schet_id, req.user.region_id],
  );
  main_schet = main_schet.rows[0];
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  let results = await pool.query(
    ` SELECT id, doc_num, doc_date, opisanie, summa, spravochnik_podotchet_litso_id 
        FROM avans_otchetlar_jur4 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false
    `,
    [main_schet_id, req.user.region_id],
  );
  results = results.rows;

  const resultArray = [];

  for (let result of results) {
    const prixod_child = await pool.query(
      `
            SELECT  
                avans_otchetlar_jur4_child.id,
                avans_otchetlar_jur4_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                avans_otchetlar_jur4_child.summa,
                avans_otchetlar_jur4_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                avans_otchetlar_jur4_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                avans_otchetlar_jur4_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                avans_otchetlar_jur4_child.own_schet,
                avans_otchetlar_jur4_child.own_subschet
            FROM avans_otchetlar_jur4_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = avans_otchetlar_jur4_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = avans_otchetlar_jur4_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = avans_otchetlar_jur4_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = avans_otchetlar_jur4_child.id_spravochnik_type_operatsii
            WHERE avans_otchetlar_jur4_child.user_id = $1 AND avans_otchetlar_jur4_child.isdeleted = false AND avans_otchetlar_jur4_child.avans_otchetlar_jur4_id = $2
        `,
      [req.user.region_id, result.id],
    );

    let object = { ...result };
    object.childs = prixod_child.rows;
    resultArray.push(object);
  }

  return res.status(200).json({
    success: true,
    data: resultArray,
  });
});

// jur 4 update
const jur_4_update = asyncHandler(async (req, res, next) => {
  const {
    doc_num,
    doc_date,
    summa,
    opisanie,
    spravochnik_podotchet_litso_id,
    childs,
  } = req.body;

  checkValueString(doc_date, doc_num, opisanie);
  checkValueNumber(spravochnik_podotchet_litso_id, summa);
  checkValueArray(childs);

  const main_schet_id = req.query.main_schet_id;
  let main_schet = await pool.query(
    `SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [main_schet_id, req.user.region_id],
  );
  main_schet = main_schet.rows[0];
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  let value = await pool.query(
    `SELECT * 
        FROM avans_otchetlar_jur4 
        WHERE user_id = $1 AND main_schet_id = $2 AND isdeleted = false AND id = $3
    `,
    [req.user.region_id, main_schet_id, req.params.id],
  );
  if (!value.rows[0]) {
    return next(
      new ErrorResponse("Server xatolik. Kassa document topilmadi", 404),
    );
  }

  let podotchet_litso = await pool.query(
    `SELECT * FROM spravochnik_podotchet_litso WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [spravochnik_podotchet_litso_id, req.user.region_id],
  );
  podotchet_litso = podotchet_litso.rows[0];
  if (!podotchet_litso) {
    return next(new ErrorResponse("podotchet_litso topilmadi", 404));
  }

  for (let child of childs) {
    checkValueNumber(
      child.spravochnik_operatsii_id,
      child.summa,
      child.id_spravochnik_podrazdelenie,
      child.id_spravochnik_sostav,
      child.id_spravochnik_type_operatsii,
    );

    const spravochnik_operatsii = await pool.query(
      `SELECT * FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`,
      ["bank_prixod", child.spravochnik_operatsii_id],
    );
    if (!spravochnik_operatsii.rows[0]) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }

    const spravochnik_podrazdelenie = await pool.query(
      `SELECT * FROM spravochnik_podrazdelenie WHERE user_id = $1 AND isdeleted = false AND id = $2`,
      [req.user.region_id, child.id_spravochnik_podrazdelenie],
    );
    if (!spravochnik_podrazdelenie.rows[0]) {
      return next(
        new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
      );
    }

    const spravochnik_sostav = await pool.query(
      `SELECT * FROM spravochnik_sostav WHERE user_id = $1 AND isdeleted = false AND id = $2`,
      [req.user.region_id, child.id_spravochnik_sostav],
    );
    if (!spravochnik_sostav.rows[0]) {
      return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
    }

    const spravochnik_type_operatsii = await pool.query(
      `SELECT * FROM spravochnik_type_operatsii WHERE isdeleted = false AND id = $1 AND user_id = $2`,
      [child.id_spravochnik_type_operatsii, req.user.region_id],
    );
    if (!spravochnik_type_operatsii.rows[0]) {
      return next(
        new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
      );
    }
  }

  const updateValue = await pool.query(
    `UPDATE avans_otchetlar_jur4 SET
            doc_num = $1, 
            doc_date = $2, 
            opisanie = $3, 
            summa = $4, 
            spravochnik_podotchet_litso_id = $5
        WHERE id = $6
        RETURNING * 
        `,
    [
      doc_num,
      doc_date,
      opisanie,
      summa,
      spravochnik_podotchet_litso_id,
      req.params.id,
    ],
  );

  if (!updateValue.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Malumot yangilamadi", 500));
  }

  await pool.query(
    `DELETE FROM avans_otchetlar_jur4_child WHERE avans_otchetlar_jur4_id = $1`,
    [req.params.id],
  );

  for (let child of childs) {
    const result_child = await pool.query(
      `
            INSERT INTO avans_otchetlar_jur4_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                own_schet,
                own_subschet,
                main_schet_id,
                avans_otchetlar_jur4_id,
                user_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        child.spravochnik_operatsii_id,
        child.summa,
        child.id_spravochnik_podrazdelenie,
        child.id_spravochnik_sostav,
        child.id_spravochnik_type_operatsii,
        main_schet.jur2_schet,
        main_schet.jur2_subschet,
        main_schet.id,
        req.params.id,
        req.user.region_id,
      ],
    );
    if (!result_child.rows[0]) {
      return next(
        new ErrorResponse("Server xatolik. Child yozuv kiritilmadi", 500),
      );
    }
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// delete jur 4
const delete_jur_4 = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  let main_schet = await pool.query(
    `SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [main_schet_id, req.user.region_id],
  );
  main_schet = main_schet.rows[0];
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const childs = await pool.query(
    `UPDATE avans_otchetlar_jur4_child 
        SET isdeleted = true
        WHERE avans_otchetlar_jur4_id = $1 AND isdeleted = false AND  user_id = $2 AND main_schet_id = $3
        RETURNING * 
    `,
    [req.params.id, req.user.region_id, main_schet_id],
  );

  if (childs.rows.length === 0) {
    return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500));
  }

  const result = await pool.query(
    `UPDATE avans_otchetlar_jur4
        SET isdeleted = true
        WHERE id = $1 AND isdeleted = false AND  user_id = $2 AND main_schet_id = $3
        RETURNING * 
    `,
    [req.params.id, req.user.region_id, main_schet_id],
  );

  if (result.rows.length === 0) {
    return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id jur 4
const getElementByIdjur_4 = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  let main_schet = await pool.query(
    `SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [main_schet_id, req.user.region_id],
  );
  main_schet = main_schet.rows[0];
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  let results = await pool.query(
    ` SELECT id, doc_num, doc_date, opisanie, summa, spravochnik_podotchet_litso_id 
        FROM avans_otchetlar_jur4 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false AND id = $3
    `,
    [main_schet_id, req.user.region_id, req.params.id],
  );
  results = results.rows;

  if (results.length === 0) {
    return next(
      new ErrorResponse("Server xatolik. Prixod documentlar topilmadi", [404]),
    );
  }

  const resultArray = [];

  for (let result of results) {
    const prixod_child = await pool.query(
      `
            SELECT  
                avans_otchetlar_jur4_child.id,
                avans_otchetlar_jur4_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                avans_otchetlar_jur4_child.summa,
                avans_otchetlar_jur4_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                avans_otchetlar_jur4_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                avans_otchetlar_jur4_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                avans_otchetlar_jur4_child.own_schet,
                avans_otchetlar_jur4_child.own_subschet
            FROM avans_otchetlar_jur4_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = avans_otchetlar_jur4_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = avans_otchetlar_jur4_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = avans_otchetlar_jur4_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = avans_otchetlar_jur4_child.id_spravochnik_type_operatsii
            WHERE avans_otchetlar_jur4_child.user_id = $1 AND avans_otchetlar_jur4_child.isdeleted = false AND avans_otchetlar_jur4_child.avans_otchetlar_jur4_id = $2
        `,
      [req.user.region_id, result.id],
    );

    let object = { ...result };
    object.childs = prixod_child.rows;
    resultArray.push(object);
  }

  return res.status(200).json({
    success: true,
    data: resultArray,
  });
});

module.exports = {
  jur_4_create,
  getAllJur_4,
  jur_4_update,
  delete_jur_4,
  getElementByIdjur_4,
};
