const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require("../../config/db");

const { jur3Validation } = require('../../helpers/validation/bajarilgan_ishlar/jur_3.validation')
const { getByIdMainSchet } = require('../../service/spravochnik/main.schet.db')
const { getByIdOrganization } = require('../../service/spravochnik/organization.db')
const { getByIdShartnomaDB } = require('../../service/shartnoma/shartnoma.db')
const { getByIdOperatsii } = require('../../service/spravochnik/operatsii.db')
const { getByIdPodrazlanie } = require('../../service/spravochnik/podrazdelenie.db')
const { getByIdSostav } = require('../../service/spravochnik/sostav.db')
const { getByIdtype_operatsii } = require('../../service/spravochnik/type_operatsii.db')
const {
  createJur3DB,
  createJur3ChildDB
} = require('../../service/bajarilgan_ishlar/jur_3.db')

// jur_3 create
const jur_3_create = asyncHandler(async (req, res, next) => {

  const { error, value } = jur3Validation.validate(req.body)
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406))
  }

  const region_id = req.user.region_id
  const user_id = req.user.id
  const main_schet_id = req.query.main_schet_id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id)
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const spravochnik_operatsii_own = await getByIdOperatsii(value.spravochnik_operatsii_own_id, 'Akt_priyom_peresdach')
  if (!spravochnik_operatsii_own) {
    return next(new ErrorResponse("Server xatolik. spravochnik_operatsii_own topilmadi", 404))
  }
  const organization = await getByIdOrganization(region_id, value.id_spravochnik_organization)
  if (!organization) {
    return next(new ErrorResponse("spravochnik_organization topilmadi", 404));
  }

  if (value.shartnomalar_organization_id) {
    const shartnoma = await getByIdShartnomaDB(region_id, main_schet_id, value.shartnomalar_organization_id)
    if (!shartnoma) {
      return next(new ErrorResponse("shartnomalar_organization topilmadi", 404));
    }
  }

  for (let child of value.childs) {
    const spravochnik_operatsii = await getByIdOperatsii(child.spravochnik_operatsii_id, 'Akt_priyom_peresdach')
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (child.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(region_id, child.id_spravochnik_podrazdelenie)
      if (!spravochnik_podrazdelenie) {
        return next(new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404));
      }
    }
    if (child.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdPodrazlanie(region_id, child.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if(child.id_spravochnik_sostav){
      const spravochnik_sostav = await getByIdSostav(region_id, child.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if(child.id_spravochnik_type_operatsii){
      const spravochnik_type_operatsii = await getByIdtype_operatsii(region_id, child.id_spravochnik_type_operatsii)
      if (!spravochnik_type_operatsii) {
        return next(new ErrorResponse("spravochnik_type_operatsii topilmadi", 404));
      }
    }
  }

  const result = await createJur3DB({ ...value, main_schet_id, user_id})

  for (let child of value.childs) {
    await createJur3ChildDB({
      ...child, 
      main_schet_id, 
      user_id, 
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id,
      id: result.id
    })
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// jur_3 get all
const jur_3_get_all = asyncHandler(async (req, res, next) => {
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
    ` SELECT id, doc_num, doc_date, opisanie, summa, id_spravochnik_organization, shartnomalar_organization_id
        FROM bajarilgan_ishlar_jur3 
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
                bajarilgan_ishlar_jur3_child.id,
                bajarilgan_ishlar_jur3_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bajarilgan_ishlar_jur3_child.summa,
                bajarilgan_ishlar_jur3_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bajarilgan_ishlar_jur3_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bajarilgan_ishlar_jur3_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bajarilgan_ishlar_jur3_child.own_schet,
                bajarilgan_ishlar_jur3_child.own_subschet
            FROM bajarilgan_ishlar_jur3_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bajarilgan_ishlar_jur3_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bajarilgan_ishlar_jur3_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bajarilgan_ishlar_jur3_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bajarilgan_ishlar_jur3_child.id_spravochnik_type_operatsii
            WHERE bajarilgan_ishlar_jur3_child.user_id = $1 AND bajarilgan_ishlar_jur3_child.isdeleted = false AND bajarilgan_ishlar_jur3_child.bajarilgan_ishlar_jur3_id = $2
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

// jur_3 update
const jur_3_update = asyncHandler(async (req, res, next) => {
  const {
    doc_num,
    doc_date,
    summa,
    opisanie,
    id_spravochnik_organization,
    shartnomalar_organization_id,
    childs,
  } = req.body;

  checkValueString(doc_date, doc_num, opisanie);
  checkValueNumber(
    summa,
    id_spravochnik_organization,
    shartnomalar_organization_id,
  );
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

  let organization = await pool.query(
    `SELECT * FROM spravochnik_organization WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [id_spravochnik_organization, req.user.region_id],
  );
  organization = organization.rows[0];
  if (!organization) {
    return next(new ErrorResponse("spravochnik_organization topilmadi", 404));
  }

  let shartnoma = await pool.query(
    `SELECT * FROM shartnomalar_organization WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [shartnomalar_organization_id, req.user.region_id],
  );
  shartnoma = shartnoma.rows[0];
  if (!shartnoma) {
    return next(new ErrorResponse("shartnomalar_organization topilmadi", 404));
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
      ["kassa_prixod_rasxod", child.spravochnik_operatsii_id],
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
    `UPDATE bajarilgan_ishlar_jur3 SET
            doc_num = $1, 
            doc_date = $2, 
            summa = $3,
            opisanie = $4, 
            id_spravochnik_organization = $5, 
            shartnomalar_organization_id = $6
        WHERE id = $7
        RETURNING * 
        `,
    [
      doc_num,
      doc_date,
      summa,
      opisanie,
      id_spravochnik_organization,
      shartnomalar_organization_id,
      req.params.id,
    ],
  );

  if (!updateValue.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Malumot yangilamadi", 500));
  }

  await pool.query(
    `DELETE FROM bajarilgan_ishlar_jur3_child WHERE bajarilgan_ishlar_jur3_id = $1`,
    [req.params.id],
  );

  for (let child of childs) {
    const result_child = await pool.query(
      `
            INSERT INTO bajarilgan_ishlar_jur3_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                own_schet,
                own_subschet,
                main_schet_id,
                bajarilgan_ishlar_jur3_id,
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
        updateValue.rows[0].id,
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

// delete jur_3
const deleteJur_3 = asyncHandler(async (req, res, next) => {
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
    `UPDATE bajarilgan_ishlar_jur3_child 
        SET isdeleted = true
        WHERE bajarilgan_ishlar_jur3_id = $1 AND isdeleted = false AND  user_id = $2 AND main_schet_id = $3
        RETURNING * 
    `,
    [req.params.id, req.user.region_id, main_schet_id],
  );

  if (childs.rows.length === 0) {
    return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500));
  }

  const result = await pool.query(
    `UPDATE bajarilgan_ishlar_jur3
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

// get element by id jur_3
const getElementByIdJur_3 = asyncHandler(async (req, res, next) => {
  let main_schet_id = req.query.main_schet_id;

  let results = await pool.query(
    ` SELECT id, doc_num, doc_date, opisanie, summa, id_spravochnik_organization, shartnomalar_organization_id
        FROM bajarilgan_ishlar_jur3 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false AND id = $3
    `,
    [main_schet_id, req.user.region_id, req.params.id],
  );
  results = results.rows;

  if (results.length === 0) {
    return next(
      new ErrorResponse(
        "Server xatolik. Bajarilgan ishlar document topilmadi",
        [404],
      ),
    );
  }

  const resultArray = [];

  for (let result of results) {
    const prixod_child = await pool.query(
      `
            SELECT  
                bajarilgan_ishlar_jur3_child.id,
                bajarilgan_ishlar_jur3_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bajarilgan_ishlar_jur3_child.summa,
                bajarilgan_ishlar_jur3_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bajarilgan_ishlar_jur3_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bajarilgan_ishlar_jur3_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bajarilgan_ishlar_jur3_child.own_schet,
                bajarilgan_ishlar_jur3_child.own_subschet
            FROM bajarilgan_ishlar_jur3_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bajarilgan_ishlar_jur3_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bajarilgan_ishlar_jur3_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bajarilgan_ishlar_jur3_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bajarilgan_ishlar_jur3_child.id_spravochnik_type_operatsii
            WHERE bajarilgan_ishlar_jur3_child.user_id = $1 AND bajarilgan_ishlar_jur3_child.isdeleted = false AND bajarilgan_ishlar_jur3_child.bajarilgan_ishlar_jur3_id = $2
        `,
      [req.user.region_id, result.id],
    );

    let object = { ...result };
    object.childs = prixod_child.rows;
    resultArray.push(object);
  }

  return res.status(200).json({
    success: true,
    data: resultArray[0],
  });
});

module.exports = {
  jur_3_create,
  jur_3_get_all,
  jur_3_update,
  getElementByIdJur_3,
  deleteJur_3,
};
