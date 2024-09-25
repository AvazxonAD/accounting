const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require("../../config/db");

const { getByIdMainSchet } = require('../../service/spravochnik/main.schet.db')
const { getByIdOrganization } = require('../../service/spravochnik/organization.db')
const { getByIdShartnoma } = require('../../service/shartnoma/shartnoma.db')
const { getByIdOperatsii } = require('../../service/spravochnik/operatsii.db')
const { getByIdPodrazlanie } = require('../../service/spravochnik/podrazdelenie.db')
const { getByIdSostav } = require('../../service/spravochnik/sostav.db')
const { getByIdtype_operatsii } = require('../../service/spravochnik/type_operatsii.db')

const {
  bankRasxodValidation,
  bankRasxodChildValidation
} = require('../../helpers/validation/bank/bank.rasxod.validation');
const { createBankRasxodDb, createBankRasxodChild, getByIdRasxod, updateRasxod } = require("../../service/bank/bank.rasxod.db");

// bank rasxod
const bank_rasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const user_id = req.user.region_id

  const { error, value } = bankRasxodValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406))
  }


  const main_schet = await getByIdMainSchet(user_id, main_schet_id)
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const organization = await getByIdOrganization(user_id, value.id_spravochnik_organization)
  if (!organization) {
    return next(new ErrorResponse("Hamkor korxona topilmadi", 404));
  }

  if (value.id_shartnomalar_organization) {
    const contract = await getByIdShartnoma(user_id, value.id_shartnomalar_organization)
    if (!contract) {
      return next(new ErrorResponse("Shartnoma topilmadi", 404));
    }
  }

  const spravochnik_operatsii = await getByIdOperatsii(value.spravochnik_operatsii_own_id)
  if(!spravochnik_operatsii){
    return next(new ErrorResponse("Server xatolik. spravochnik_operatsii_own  topilmadi", 404))
  }

  for (let child of value.childs) {
    const { error, value } = bankRasxodChildValidation.validate(child)
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 406))
    }

    const spravochnik_operatsii = await getByIdOperatsii(value.spravochnik_operatsii_id)
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (value.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(user_id, value.id_spravochnik_podrazdelenie)
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (value.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(user_id, value.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (value.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(user_id, value.id_spravochnik_type_operatsii)
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }
  }

  const rasxod = await createBankRasxodDb({
    ...value,
    main_schet_id,
    user_id
  })

  for (let child of value.childs) {
    await createBankRasxodChild({
      ...child,
      jur2_schet: main_schet.jur2_schet,
      jur2_subschet: main_schet.jur2_subschet,
      main_schet_id,
      rasxod_id: rasxod.id,
      user_id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id
    })
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// bank rasxod update
const bank_rasxod_update = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const user_id = req.user.region_id
  const id = req.params.id

  const bank_rasxod = await getByIdRasxod(user_id, main_schet_id, id)
  if (!bank_rasxod) {
    return next(new ErrorResponse("Prixod document topilmadi", 404));
  }

  const { error, value } = bankRasxodValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406))
  }


  const main_schet = await getByIdMainSchet(user_id, main_schet_id)
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const organization = await getByIdOrganization(user_id, value.id_spravochnik_organization)
  if (!organization) {
    return next(new ErrorResponse("Hamkor korxona topilmadi", 404));
  }

  if (value.id_shartnomalar_organization) {
    const contract = await getByIdShartnoma(user_id, value.id_shartnomalar_organization)
    if (!contract) {
      return next(new ErrorResponse("Shartnoma topilmadi", 404));
    }
  }

  const spravochnik_operatsii = await getByIdOperatsii(value.spravochnik_operatsii_own_id)
  if(!spravochnik_operatsii){
    return next(new ErrorResponse("Server xatolik. spravochnik_operatsii_own  topilmadi", 404))
  }

  for (let child of value.childs) {
    const { error, value } = bankRasxodChildValidation.validate(child)
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 406))
    }

    const spravochnik_operatsii = await getByIdOperatsii(value.spravochnik_operatsii_id)
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (value.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(user_id, value.id_spravochnik_podrazdelenie)
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (value.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(user_id, value.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (value.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(user_id, value.id_spravochnik_type_operatsii)
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }
  }

  await updateRasxod({
    ...value,
    id,
    procod
  })

  if (!prixod.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Malumot Yangilanmadi", 500));
  }
  await pool.query(`DELETE FROM bank_rasxod_child WHERE id_bank_rasxod = $1`, [
    bank_rasxod.id,
  ]);

  for (let child of childs) {
    const bank_child = await pool.query(
      `
            INSERT INTO bank_rasxod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                main_schet_id,
                id_bank_rasxod,
                user_id,
                own_schet,
                own_subschet
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        child.spravochnik_operatsii_id,
        child.summa,
        child.id_spravochnik_podrazdelenie,
        child.id_spravochnik_sostav,
        child.id_spravochnik_type_operatsii,
        main_schet.id,
        bank_rasxod.id,
        req.user.region_id,
        main_schet.jur2_schet,
        main_schet.jur2_subschet,
      ],
    );
    if (!bank_child.rows[0]) {
      return next(
        new ErrorResponse("Server xatolik. Child yozuv kiritilmadi", 500),
      );
    }
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// get all bank rasxod
const getAllBankRasxod = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  let all_rasxod = await pool.query(
    `
        SELECT 
            id,
            doc_num, 
            doc_date, 
            summa, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization
        FROM bank_rasxod 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false
    `,
    [req.query.main_schet_id, req.user.region_id],
  );
  all_rasxod = all_rasxod.rows;

  if (all_rasxod.length === 0) {
    return next(
      new ErrorResponse("Server xatolik. Prixod documentlar topilmadi", [404]),
    );
  }

  const resultArray = [];

  for (let rasxod of all_rasxod) {
    const rasxod_child = await pool.query(
      `
            SELECT  
                bank_rasxod_child.id,
                bank_rasxod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bank_rasxod_child.summa,
                bank_rasxod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bank_rasxod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bank_rasxod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bank_rasxod_child.own_schet,
                bank_rasxod_child.own_subschet
            FROM bank_rasxod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_rasxod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_rasxod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_rasxod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_rasxod_child.id_spravochnik_type_operatsii
            WHERE bank_rasxod_child.user_id = $1 AND bank_rasxod_child.isdeleted = false AND bank_rasxod_child.id_bank_rasxod = $2
        `,
      [req.user.region_id, rasxod.id],
    );

    let object = { ...rasxod };
    object.summa = Number(object.summa);
    object.childs = rasxod_child.rows.map((item) => {
      let result = { ...item };
      result.summa = Number(result.summa);
      return result;
    });
    resultArray.push(object);
  }

  return res.status(200).json({
    success: true,
    data: resultArray,
  });
});

// get element by id bank rasxod
const getElementByIdBankRasxod = asyncHandler(async (req, res, next) => {
  let all_rasxod = await pool.query(
    `
        SELECT 
            id,
            doc_num, 
            doc_date, 
            summa, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization
        FROM bank_rasxod 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false AND id = $3
    `,
    [req.query.main_schet_id, req.user.region_id, req.params.id],
  );
  all_rasxod = all_rasxod.rows;

  if (all_rasxod.length === 0) {
    return next(
      new ErrorResponse("Server xatolik. Prixod documentlar topilmadi", [404]),
    );
  }

  const resultArray = [];

  for (let rasxod of all_rasxod) {
    const rasxod_child = await pool.query(
      `
            SELECT  
                bank_rasxod_child.id,
                bank_rasxod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bank_rasxod_child.summa,
                bank_rasxod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bank_rasxod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bank_rasxod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bank_rasxod_child.own_schet,
                bank_rasxod_child.own_subschet
            FROM bank_rasxod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_rasxod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_rasxod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_rasxod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_rasxod_child.id_spravochnik_type_operatsii
            WHERE bank_rasxod_child.user_id = $1 AND bank_rasxod_child.isdeleted = false AND bank_rasxod_child.id_bank_rasxod = $2
        `,
      [req.user.region_id, rasxod.id],
    );

    let object = { ...rasxod };
    object.summa = Number(object.summa);
    object.childs = rasxod_child.rows.map((item) => {
      let result = { ...item };
      result.summa = Number(result.summa);
      return result;
    });
    resultArray.push(object);
  }

  return res.status(200).json({
    success: true,
    data: resultArray,
  });
});

// delete bank_rasxod
const delete_bank_rasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const main_schet = await pool.query(
    `SELECT * FROM main_schet WHERE id = $1 AND  user_id = $2 AND isdeleted = false
    `,
    [main_schet_id, req.user.region_id],
  );
  if (!main_schet.rows[0]) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 500));
  }

  const childs = await pool.query(
    `DELETE FROM bank_rasxod_child 
        WHERE user_id = $1 AND id_bank_rasxod = $2 AND isdeleted = false AND main_schet_id = $3 
        RETURNING * 
    `,
    [req.user.region_id, req.params.id, main_schet_id],
  );
  if (childs.rows.length === 0) {
    return next(
      new ErrorResponse("Server xatolik. Bank child ochirilmadi", 500),
    );
  }

  const bank_rasxod = await pool.query(
    `DELETE FROM bank_rasxod WHERE user_id = $1 AND id = $2 AND isdeleted = false
    `,
    [req.user.region_id, req.params.id],
  );
  if (!bank_rasxod.rows.length === 0) {
    return next(
      new ErrorResponse("Server xatolik. Bank prixod topilmadi", 500),
    );
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

module.exports = {
  delete_bank_rasxod,
  getElementByIdBankRasxod,
  getAllBankRasxod,
  bank_rasxod,
  bank_rasxod_update,
};
