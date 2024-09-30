const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require("../../config/db");
const { kassaValidation } = require("../../helpers/validation/kassa/kassa.validation");
const { queryValidation } = require('../../helpers/validation/bank/bank.prixod.validation')
const { returnLocalDate } = require('../../utils/date.function')

const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.db");
const { getByIdPodotchet } = require("../../service/spravochnik/podotchet.litso.db");
const { getByIdOperatsii } = require('../../service/spravochnik/operatsii.db')
const { getByIdPodrazlanie } = require('../../service/spravochnik/podrazdelenie.db');
const { getByIdSostav } = require("../../service/spravochnik/sostav.db");
const { getByIdtype_operatsii } = require("../../service/spravochnik/type_operatsii.db");
const {
  kassaRasxodCreateDB,
  kassaRasxodChild,
  getAllKassaRasxodDb,
  getAllKassaRasxodChild,
  getElementById,
  updateKassaRasxodDB,
  deleteKassaRasxodChild,
  deleteKassaRasxodDB
} = require("../../service/kassa/kassa.rasxod.db");
const { returnAllChildSumma, sum } = require('../../utils/returnSumma')

// kassa rasxod rasxod
const kassaRasxodCreate = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const user_id = req.user.id;
  const region_id = req.user.region_id

  const { error, value } = kassaValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406))
  }

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const spravochnik_operatsii_own = await getByIdOperatsii(value.spravochnik_operatsii_own_id)
  if (spravochnik_operatsii_own) {
    return next(new ErrorResponse("Server xatolik. spravochnik_operatsii_own topilmadi", 404))
  }
  if (value.id_podotchet_litso) {
    const podotchet_litso = await getByIdPodotchet(region_id, value.id_podotchet_litso);
    if (!podotchet_litso) {
      return next(new ErrorResponse("podotchet_litso topilmadi", 404));
    }
  }

  for (let child of value.childs) {
    const spravochnik_operatsii = await getByIdOperatsii(child.spravochnik_operatsii_id)
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
      const spravochnik_sostav = await getByIdSostav(region_id, child.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (child.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(region_id, child.id_spravochnik_type_operatsii)
      if (!spravochnik_type_operatsii) {
        return next(new ErrorResponse("spravochnik_type_operatsii topilmadi", 404));
      }
    }
  }
  const summa = returnAllChildSumma(value.childs)

  const kassa_rasxod = await kassaRasxodCreateDB({
    ...value,
    user_id,
    main_schet_id,
    summa,
  })

  for (let child of value.childs) {
    await kassaRasxodChild({
      ...child,
      user_id,
      main_schet_id,
      kassa_rasxod_id: kassa_rasxod.id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id
    })
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// get all kassa rasxod 
const getAllKassaRasxod = asyncHandler(async (req, res, next) => {
  const { error, value } = queryValidation.validate(req.query)
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406))
  }

  const main_schet_id = value.main_schet_id;
  const region_id = req.user.region_id

  const limit = parseInt(value.limit) || 10;
  const page = parseInt(value.page) || 1;
  const from = value.from
  const to = value.to

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }
  const main_schet = await getByIdMainSchet(region_id, main_schet_id)
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const offset = (page - 1) * limit;

  const data = await getAllKassaRasxodDb(region_id, main_schet_id, from, to, offset, limit)

  const resultArray = [];

  for (let result of data.rows) {
    const rasxod_child = await getAllKassaRasxodChild(region_id, main_schet_id, result.id)
    let object = { ...result };
    object.summa = Number(object.summa)
    object.doc_date = returnLocalDate(object.doc_date)
    object.childs = rasxod_child.map(item => {
      item.summa = Number(item.summa)
      return item
    })
    resultArray.push(object);
  }

  const total = Number(data.totalQuery.total_count);
  const pageCount = Math.ceil(total / limit);
  const summa = Number(data.summa)

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

// kassa rasxod update
const updateKassaRasxodBank = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id
  const id = req.params.id
  const user_id = req.user.id
  
  const result = await getElementById(region_id, main_schet_id, id)
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Rasxod document topilmadi", 404));
  }

  const { error, value } = kassaValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406))
  }

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const spravochnik_operatsii_own = await getByIdOperatsii(value.spravochnik_operatsii_own_id)
  if (spravochnik_operatsii_own) {
    return next(new ErrorResponse("Server xatolik. spravochnik_operatsii_own topilmadi", 404))
  }
  if (value.id_podotchet_litso) {
    const podotchet_litso = await getByIdPodotchet(region_id, value.id_podotchet_litso);
    if (!podotchet_litso) {
      return next(new ErrorResponse("podotchet_litso topilmadi", 404));
    }
  }

  for (let child of value.childs) {
    const spravochnik_operatsii = await getByIdOperatsii(child.spravochnik_operatsii_id)
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
      const spravochnik_sostav = await getByIdSostav(region_id, child.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (child.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(region_id, child.id_spravochnik_type_operatsii)
      if (!spravochnik_type_operatsii) {
        return next(new ErrorResponse("spravochnik_type_operatsii topilmadi", 404));
      }
    }
  }
  const summa = returnAllChildSumma(value.childs)

  await updateKassaRasxodDB({...value, id, summa})

  await deleteKassaRasxodChild(id)

  for (let child of value.childs) {
    await kassaRasxodChild({
      ...child,
      user_id,
      main_schet_id,
      kassa_rasxod_id: id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id
    })
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// delete kassa rasxod rasxod
const deleteKassaRasxodRasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id
  const id = req.params.id
  
  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const test = await getElementById(region_id, main_schet_id, id)
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Rasxod document topilmadi", 404));
  }

  await deleteKassaRasxodChild(id)
  await deleteKassaRasxodDB(id)

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id kassa rasxod
const getElementByIdKassaRasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id
  const id = req.params.id

  const result = await getElementById(region_id, main_schet_id, id)
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Rasxod document topilmadi", 404));
  }

  const rasxod_childs = await getAllKassaRasxodChild(region_id, main_schet_id, result.id)

  let object = { ...result };
  object.summa = Number(object.summa)
  object.doc_date = returnLocalDate(object.doc_date)
  object.childs = rasxod_childs.map(item => {
    item.summa = Number(item.summa)
    return item;
  })


  return res.status(200).json({
    success: true,
    data: object
  });
});

module.exports = {
  kassaRasxodCreate,
  getAllKassaRasxod,
  updateKassaRasxodBank,
  deleteKassaRasxodRasxod,
  getElementByIdKassaRasxod,
};
