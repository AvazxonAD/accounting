const {
  kassaRasxodCreateDB,
  kassaRasxodChild,
  getAllKassaRasxodDb,
  getElementById,
  updateKassaRasxodDB,
  deleteKassaRasxodChild,
  deleteKassaRasxodDB,
} = require("../../service/kassa/kassa.rasxod.service");
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
const { errorCatch } = require('../../helpers/errorCatch')

// kassa rasxod rasxod
const kassaRasxodCreate = async (req, res) => {
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
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "kassa_rasxod");
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
    const kassa_rasxod = await kassaRasxodCreateDB({ ...data, user_id, main_schet_id, summa });
    const childs = []
    for (let child of data.childs) {
      const result = await kassaRasxodChild({ ...child, user_id, main_schet_id, kassa_rasxod_id: kassa_rasxod.id });
      childs.push(result)
    }
    kassa_rasxod.childs = childs
    resFunc(res, 200, kassa_rasxod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all kassa rasxod
const getAllKassaRasxod = async (req, res) => {
  try {
    const { main_schet_id, page, limit, from, to } = validationResponse(queryValidation, req.query)
    const region_id = req.user.region_id;
    await getByIdMainSchetService(region_id, main_schet_id);
    const offset = (page - 1) * limit;
    const { data, total, summa } = await getAllKassaRasxodDb(region_id, main_schet_id, from, to, offset, limit);
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

// kassa rasxod update
const updateKassaRasxodBank = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    await getElementById(region_id, main_schet_id, id);
    await getByIdMainSchetService(region_id, main_schet_id);
    const data = validationResponse(kassaValidation, req.body)
    if (data.id_podotchet_litso) {
      await getByIdPodotchetService(region_id, data.id_podotchet_litso);
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "kassa_rasxod");
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
    const rasxod = await updateKassaRasxodDB({ ...data, id, summa });
    await deleteKassaRasxodChild(id);
    const childs = []
    for (let child of data.childs) {
      const result = await kassaRasxodChild({ ...child, user_id, main_schet_id, kassa_rasxod_id: id });
      childs.push(result)
    }
    rasxod.childs = childs
    resFunc(res, 200, rasxod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete kassa rasxod rasxod
const deleteKassaRasxodRasxod = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdMainSchetService(region_id, main_schet_id);
    await getElementById(region_id, main_schet_id, id);
    await deleteKassaRasxodDB(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id kassa rasxod
const getElementByIdKassaRasxod = async (req, res) => {
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
  kassaRasxodCreate,
  getAllKassaRasxod,
  updateKassaRasxodBank,
  deleteKassaRasxodRasxod,
  getElementByIdKassaRasxod,
};
