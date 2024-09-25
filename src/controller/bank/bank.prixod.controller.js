const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require("../../config/db");
const { bankPrixodValidator, bankPrixodChildValidation, getAllPrixodValidation } = require('../../helpers/validation/bank/bank.prixod.validation')

const { getByIdShartnoma } = require('../../service/shartnoma/shartnoma.db')
const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.db");
const { getByIdOrganization } = require("../../service/spravochnik/organization.db");
const { getByIdOperatsii } = require("../../service/spravochnik/operatsii.db");
const { getByIdPodrazlanie } = require("../../service/spravochnik/podrazdelenie.db");
const { getByIdSostav } = require("../../service/spravochnik/sostav.db");
const { getByIdtype_operatsii } = require("../../service/spravochnik/type_operatsii.db");
const { getByIdPodotchet } = require("../../service/spravochnik/podotchet_lito.db");
const {
  createBankPrixod,
  createBankPrixodChild,
  getByIdBankPrixod,
  bankPrixodUpdate,
  deleteBankPrixodChild,
  getAllPrixod,
  getAllPrixodChild,
  prixodTotalQuery,
  getAllPrixodByFrom,
  getAllPrixodByTo,
  getAllPrixodByFromAndTo,
  getElementByIdPrixod
} = require('../../service/bank/bank.prixod.db')

// bank prixod create 
const bank_prixod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const user_id = req.user.region_id;

  const { error, value } = bankPrixodValidator.validate(req.body)
  if (error) {
    return next(new ErrorResponse(error.details[0].message), 406);
  }

  const main_schet = await getByIdMainSchet(user_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const organization = await getByIdOrganization(user_id, value.id_spravochnik_organization);
  if (!organization) {
    return next(new ErrorResponse("Hamkor korxona topilmadi", 404));
  }

  if (value.id_shartnomalar_organization) {
    const contract = await getByIdShartnoma(user_id, value.id_shartnomalar_organization)
    if (!contract) {
      return next(new ErrorResponse("Shartnoma topilmadi", 404));
    }
  }

  const spravochnik_operatsii_own_id_test = await getByIdOperatsii(value.spravochnik_operatsii_own_id);
  if (!spravochnik_operatsii_own_id_test) {
    return next(new ErrorResponse("Server xatolik. spravochnik_operatsii_own topilmadi", 404));
  }

  for (let child of value.childs) {
    const { error, value } = bankPrixodChildValidation.validate(child)
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 406))
    }

    const spravochnik_operatsii = await getByIdOperatsii(value.spravochnik_operatsii_id);
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (value.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(
        user_id,
        value.id_spravochnik_podrazdelenie,
      );
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (value.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(
        user_id,
        value.id_spravochnik_sostav,
      );
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("Server xatolik. Sostav topilmadi", 404));
      }
    }

    if (value.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = getByIdtype_operatsii(
        user_id,
        value.id_spravochnik_type_operatsii,
      );
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }

    if (value.id_spravochnik_podotchet_litso) {
      const spravochnik_podotchet_litso = await getByIdPodotchet(
        user_id,
        value.id_spravochnik_podotchet_litso,
      );

      if (!spravochnik_podotchet_litso) {
        return next(
          new ErrorResponse("spravochnik_podotchet_litso topilmadi", 404),
        );
      }
    }
  }

  const prixod = await createBankPrixod({
    ...value,
    main_schet_id,
    user_id,
    provodki_boolean: true
  })

  for (let child of value.childs) {
    await createBankPrixodChild({
      ...child,
      jur2_schet: main_schet.jur2_schet,
      jur2_subschet: main_schet.jur2_subschet,
      main_schet_id: main_schet.id,
      bank_prixod_id: prixod.id,
      user_id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id
    })
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// bank prixod update
const bank_prixod_update = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id
  const user_id = req.user.region_id

  const bank_prixod = await getByIdBankPrixod(user_id, main_schet_id, id)
  if (!bank_prixod) {
    return next(new ErrorResponse("Prixod document topilmadi", 404));
  }

  const { error, value } = bankPrixodValidator.validate(req.body)
  if (error) {
    return next(new ErrorResponse(error.details[0].message), 406);
  }

  const main_schet = await getByIdMainSchet(user_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const organization = await getByIdOrganization(user_id, value.id_spravochnik_organization);
  if (!organization) {
    return next(new ErrorResponse("Hamkor korxona topilmadi", 404));
  }

  if (value.id_shartnomalar_organization) {
    const contract = await getByIdShartnoma(user_id, value.id_shartnomalar_organization)
    if (!contract) {
      return next(new ErrorResponse("Shartnoma topilmadi", 404));
    }
  }

  const spravochnik_operatsii_own_id_test = await getByIdOperatsii(value.spravochnik_operatsii_own_id);
  if (!spravochnik_operatsii_own_id_test) {
    return next(new ErrorResponse("Server xatolik. spravochnik_operatsii_own topilmadi", 404));
  }

  for (let child of value.childs) {
    const { error, value } = bankPrixodChildValidation.validate(child)
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 406))
    }

    const spravochnik_operatsii = await getByIdOperatsii(value.spravochnik_operatsii_id);
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (value.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(
        user_id,
        value.id_spravochnik_podrazdelenie,
      );
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (value.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(
        user_id,
        value.id_spravochnik_sostav,
      );
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("Server xatolik. Sostav topilmadi", 404));
      }
    }

    if (value.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = getByIdtype_operatsii(
        user_id,
        value.id_spravochnik_type_operatsii,
      );
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }

    if (value.id_spravochnik_podotchet_litso) {
      const spravochnik_podotchet_litso = await getByIdPodotchet(
        user_id,
        value.id_spravochnik_podotchet_litso,
      );

      if (!spravochnik_podotchet_litso) {
        return next(
          new ErrorResponse("spravochnik_podotchet_litso topilmadi", 404),
        );
      }
    }
  }

  await bankPrixodUpdate({
    ...value,
    id,
    provodki_boolean: true
  })

  await deleteBankPrixodChild(id)

  for (let child of value.childs) {
    await createBankPrixodChild({
      ...child,
      jur2_schet: main_schet.jur2_schet,
      jur2_subschet: main_schet.jur2_subschet,
      main_schet_id: main_schet.id,
      bank_prixod_id: id,
      user_id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id
    })
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// delete bank_prixod
const delete_bank_prixod = asyncHandler(async (req, res, next) => {
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
    `Update bank_prixod_child SET isdeleted = true
        WHERE user_id = $1 AND id_bank_prixod = $2 AND isdeleted = false AND main_schet_id = $3 
        RETURNING * 
    `,
    [req.user.region_id, req.params.id, main_schet_id],
  );

  const bank_prixod = await pool.query(
    `UPDATE bank_prixod SET isdeleted = true 
        WHERE user_id = $1 AND id = $2 AND isdeleted = false
    `,
    [req.user.region_id, req.params.id],
  );
  if (!bank_prixod.rows.length === 0) {
    return next(
      new ErrorResponse("Server xatolik. Bank prixod topilmadi", 500),
    );
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id bank prixod
const getElementByIdBankPrixod = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const main_schet_id = req.query.main_schet_id
  const user_id = req.user.region_id

  const prixod = await getElementByIdPrixod(user_id, main_schet_id, id)

  if (!prixod) {
    return next(
      new ErrorResponse("Server xatolik. Prixod documentlar topilmadi", [404]),
    );
  }

  const prixod_child = await getAllPrixodChild(user_id, prixod.id)
  
  let object = { ...prixod };
  object.summa = Number(object.summa);
  object.childs = prixod_child.map((item) => {
  let result = { ...item };
    result.summa = Number(result.summa);
    return result;
  });

  return res.status(200).json({
    success: true,
    data: object,
  });
});

// get all bank prixod
const getAllBankPrixod = asyncHandler(async (req, res, next) => {
  let all_prixod = null
  let totalQuery = null
  let summa = null
  
  const user_id = req.user.region_id;
  const { error, value } = getAllPrixodValidation.validate(req.query)
  if (error) {
    return next(new ErrorResponse(error.details[0].message), 406);
  }

  limit = parseInt(value.limit) || 10;
  page = parseInt(value.page) || 1;
  const offset = (page - 1) * limit;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const main_schet = await getByIdMainSchet(user_id, value.main_schet_id)
  if (!main_schet) {
    return next(new ErrorResponse("Schet topilmadi", 404));
  }

  if(value.from && !value.to){
    all_prixod = await getAllPrixodByFrom(user_id, value.main_schet_id, value.offset, value.limit, new Date(req.query.from))
  }

  if(!value.from && value.to){
    all_prixod = await getAllPrixodByTo(user_id, value.main_schet_id, value.offset, value.limit,  new Date(req.query.to))
  }

  if(value.from && value.to){
    all_prixod = await getAllPrixodByFromAndTo(user_id, value.main_schet_id, value.offset, value.limit, new Date(req.query.from), new Date(req.query.to))
  }

  all_prixod = await getAllPrixod(user_id, value.main_schet_id, value.offset, value.limit)
  summa = Number(all_prixod.summa)
  
  const resultArray = [];

  for (let prixod of all_prixod.prixod_rows) {
    const prixod_child = await getAllPrixodChild(user_id, prixod.id)
    let object = { ...prixod };
    object.summa = Number(object.summa);
    object.childs = prixod_child.map((item) => {
      let result = { ...item };
      result.summa = Number(result.summa);
      return result;
    });
    resultArray.push(object);
  }

  totalQuery = await prixodTotalQuery(user_id, value.main_schet_id)

  const pageCount = Math.ceil(totalQuery.total / limit);

  return res.status(200).json({
    success: true,
    pageCount: pageCount,
    count: totalQuery.total,
    currentPage: page,
    nextPage: page >= pageCount ? null : page + 1,
    backPage: page === 1 ? null : page - 1,
    meta: {
      summa
    },
    data: resultArray
  });
});

module.exports = {
  bank_prixod,
  getElementByIdBankPrixod,
  bank_prixod_update,
  getAllBankPrixod,
  delete_bank_prixod,
};
