const { RasxodDB } = require('./db');
const { tashkentTime, checkTovarId } = require('../../helper/functions');
const { ResponsibleService } = require('../spravochnik/responsible/service')
const { ContractDB } = require('../../shartnoma/db')
const { db } = require('../../db/index')
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db')
const { MainSchetService } = require('../../spravochnik/main.schet/services')
const { SaldoService } = require('../saldo/service');
const { Jur7RsxodService } = require('./service')

exports.Controller = class {
  static async createRasxod(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, childs } = req.body;
    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }

    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error('Responisible not found', 404);
    }

    for (let child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id])
      if (!product) {
        return res.error('Product not found', 404);
      }
      
      const tovar = await SaldoService.getSaldoForRasxod({ region_id, kimning_buynida: kimdan_id, to: doc_date, product_id: child.naimenovanie_tovarov_jur7_id });

      if (!tovar[0]) {
        return res.error('Saldo is not defined', 400)
      }

      if (tovar[0].to.kol < child.kol) {
        return res.error('The responsible person does not have sufficient information regarding this product', 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error("The product ID was sent incorrectly", 400);
    }

    await Jur7RsxodService.createRasxod({ ...req.body, main_schet_id, user_id });

    return res.success('Create doc successfully', 200);
  }

  static async getByIdRasxod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const data = await RasxodDB.getByIdRasxod([region_id, id, main_schet_id], true)
    if (!data) {
      return res.error('Doc not found', 404);
    }
    return res.status(201).json({
      message: "group successfully get",
      data
    });
  }

  static async updateRasxod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, childs } = req.body;
    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const oldData = await RasxodDB.getByIdRasxod([region_id, id, main_schet_id])
    if (!oldData) {
      return res.error('Doc not found', 404);
    }
    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error('Responisible not found', 404);
    }
    for (let child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id])
      if (!product) {
        return res.error('Product not found', 404);
      }

      const tovar = await SaldoService.getSaldoForRasxod({ region_id, kimning_buynida: kimdan_id, to: doc_date, product_id: child.naimenovanie_tovarov_jur7_id });
      if (!tovar[0]) {
        return res.error('Saldo is not defined', 400)
      }

      const old_tovar = oldData.childs.find(item => item.naimenovanie_tovarov_jur7_id === child.naimenovanie_tovarov_jur7_id)
      const add = old_tovar ? old_tovar.kol : 0;
      if ((tovar[0].to.kol + add) < child.kol) {
        return res.error('The responsible person does not have sufficient information regarding this product', 400)
      }

      child.sena = tovar[0].sena;
      child.summa = tovar[0].sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error("The product ID was sent incorrectly", 400);
    }
    
    await Jur7RsxodService.updateRasxod({...req.body, user_id, main_schet_id, id});

    return res.success('Update doc successfully', 200)
  }

  static async deleteRasxod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const rasxod_doc = await RasxodDB.getByIdRasxod([region_id, id, main_schet_id])
    if (!rasxod_doc) {
      return res.error('Doc not found', 404);
    }
    await db.transaction(async (client) => {
      await RasxodDB.deleteRasxod([id], client)
    })
    return res.status(200).json({
      message: 'delete rasxod doc successfully'
    })
  }

  static async getRasxod(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const offset = (page - 1) * limit;
    const { data, total } = await RasxodDB.getRasxod([region_id, from, to, main_schet_id, offset, limit], search)
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }
    return res.status(200).json({
      message: "group successfully get",
      meta,
      data: data || []
    })
  }
}