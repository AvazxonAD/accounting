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
const {
  createBankRasxodDb,
  createBankRasxodChild,
  getByIdRasxod,
  updateRasxod,
  getAllBankRasxodDb,
  getAllRasxodChildDb,
  getAllBankRasxodByFrom,
  getAllBankRasxodByFromAndTo,
  getElemenByIdRasxod,
  getElemenByIdRasxodChild,
  deleteRasxodChild,
  deleteBankRasxod
} = require("../../service/bank/bank.rasxod.db");

const { queryValidationBank } = require('../../helpers/validation/bank/bank.prixod.validation')


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
  if (!spravochnik_operatsii) {
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
  if (!spravochnik_operatsii) {
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
  const user_id = req.user.region_id
  let all_rasxod = null
  let totalQuery = null
  let summa = null

  const { error, value } = queryValidationBank.validate(req.query)
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406))
  }

  const limit = parseInt(value.limit) || 10;
  const page = parseInt(value.page) || 1;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  if(!value.from && !value.to){
    all_rasxod = await getAllBankRasxodDb(user_id, value.main_schet_id, offset, limit)
    totalQuery = all_rasxod.totalQuery
    summa = all_rasxod.summa
  }
  if (value.from && !value.to) {
    all_rasxod = await getAllBankRasxodByFrom(user_id, value.main_schet_id, offset, limit, value.from)
    totalQuery = all_rasxod.totalQuery
    summa = all_rasxod.summa
  }
  if (!value.from && value.to) {
    all_rasxod = await getAllBankRasxodByFrom(user_id, value.main_schet_id, offset, limit, value.to)
  }
  if (value.from && value.to) {
    all_rasxod = await getAllBankRasxodByFromAndTo(user_id, value.main_schet_id, offset, limit, value.from, value.to)
  }

  const resultArray = [];

  for (let rasxod of all_rasxod.rasxod_rows) {
    const rasxod_child = await getAllRasxodChildDb(user_id, rasxod.id)

    let object = { ...rasxod };
    object.summa = Number(object.summa);
    object.childs = rasxod_child.map((item) => {
      let result = { ...item };
      result.summa = Number(result.summa);
      return result;
    });
    resultArray.push(object);
  }
  
  const total = Number(totalQuery.count)
  const pageCount = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    meta: {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa
    },
    data: resultArray,
  });
});

// get element by id bank rasxod
const getElementByIdBankRasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id
  const id = req.params.id
  const user_id = req.user.region_id
  const rasxod = await getElemenByIdRasxod(user_id, main_schet_id, id)
  if (!rasxod) {
    return next(
      new ErrorResponse("Server xatolik. Rasxod document topilmadi", [404]),
    );
  }
  
  const rasxod_child = await getElemenByIdRasxodChild(user_id, rasxod.id)
  let object = { ...rasxod };
  object.summa = Number(object.summa);
  object.childs = rasxod_child.map((item) => {
    let result = { ...item };
    result.summa = Number(result.summa);
    return result;
  });

  return res.status(200).json({
    success: true,
    data: object,
  });
});

// delete bank_rasxod
const delete_bank_rasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const user_id = req.user.region_id
  const id = req.params.id
  const main_schet = await getByIdMainSchet(user_id, main_schet_id)
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 500));
  }

  await deleteRasxodChild(user_id, main_schet_id, id)
  await deleteBankRasxod(user_id, main_schet_id, id)

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
