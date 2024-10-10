const {
  kassaPrixodCreateDB,
  kassaPrixodChild,
  getAllKassaPrixodDb,
  getElementById,
  updateKassaPrixodDB,
  deleteKassaPrixodChild,
  deleteKassaPrixodDB
} = require("../../service/kassa/kassa.prixod.service");
const ErrorResponse = require("../../utils/errorResponse");
const { kassaValidation } = require("../../helpers/validation/kassa/kassa.validation");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getByIdPodotchetService } = require("../../service/spravochnik/podotchet.litso.service");
const { getByIdOperatsiiService } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanieService } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostavService } = require("../../service/spravochnik/sostav.service");
const { getByIdTypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { errorCatch } = require("../../helpers/errorCatch");

// kassa prixod rasxod
const kassaPrixodCreate = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const data = validationResponse(kassaValidation, req.body)
    await getByIdMainSchetService(region_id, main_schet_id);
    if (data.id_podotchet_litso) {
      await getByIdPodotchetService(region_id, data.id_podotchet_litso);
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "kassa_prixod");
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie,);
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav);
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii);
      }
    }
    const summa = returnAllChildSumma(data.childs);
    const kassa_prixod = await kassaPrixodCreateDB({ ...data, user_id, main_schet_id, summa });
    const childs = []
    for (let child of data.childs) {
      const result = await kassaPrixodChild({ ...child, user_id, main_schet_id, kassa_prixod_id: kassa_prixod.id });
      childs.push(result)
    }
    kassa_prixod.childs = childs
    resFunc(res, 201, kassa_prixod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all kassa prixod
const getAllKassaPrixod = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const { page, limit, from, to, main_schet_id } = validationResponse(queryValidation, req.query)
    await getByIdMainSchetService(region_id, main_schet_id);
    const offset = (page - 1) * limit;
    const {data, total, summa} = await getAllKassaPrixodDb(region_id, main_schet_id, from, to, offset, limit);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
    }
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// kassa prixod update
const updateKassaPrixodBank = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    await getElementById(region_id, main_schet_id, id);
    const data = validationResponse(kassaValidation, req.body)
    await getByIdMainSchetService(region_id, main_schet_id);
    if (data.id_podotchet_litso) {
      await getByIdPodotchetService( region_id, data.id_podotchet_litso);
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "kassa_prixod");
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie);
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav);
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii);
      }
    }
    const summa = returnAllChildSumma(data.childs);
    const prixod = await updateKassaPrixodDB({ ...data, id, summa });
    await deleteKassaPrixodChild(id);
    const childs = []
    for (let child of data.childs) {
      const result = await kassaPrixodChild({ ...child, user_id, main_schet_id, kassa_prixod_id: id });
      childs.push(result)
    }
    console.log(childs)
    prixod.childs = childs
    resFunc(res, 200, prixod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete kassa prixod rasxod
const deleteKassaPrixodRasxod = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdMainSchetService(region_id, main_schet_id);
    await getElementById(region_id, main_schet_id, id);
    await deleteKassaPrixodDB(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id kassa prixod
const getElementByIdKassaPrixod = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const result = await getElementById(region_id, main_schet_id, id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  kassaPrixodCreate,
  getAllKassaPrixod,
  updateKassaPrixodBank,
  deleteKassaPrixodRasxod,
  getElementByIdKassaPrixod
};
