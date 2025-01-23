const { InternalDB } = require('./db');
const { tashkentTime, checkTovarId } = require('../../helper/functions');
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const { db } = require('../../db/index')
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db')
const { MainSchetDB } = require('../../spravochnik/main.schet/db')
const { SaldoService } = require('../saldo/service')
const { Jur7InternalService } = require('./service')

exports.Controller = class {
  static async createInternal(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, kimga_id, childs } = req.body;

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }

    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id])
    if (!responsible) {
      return res.error('Responsible not found', 404);
    }

    const responsible2 = await ResponsibleDB.getByIdResponsible([region_id, kimdan_id])
    if (!responsible2) {
      return res.error('Responsible not found', 404);
    }

    for (let child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id])
      if (!product) {
        return res.error('Poduct not found', 404);
      }
      const tovar = await SaldoService.getSaldoForRasxod({ region_id, kimning_buynida: kimdan_id, to: doc_date, product_id: child.naimenovanie_tovarov_jur7_id });
      if (!tovar[0]) {
        return res.error('Saldo is not defined', 400)
      }

      if (tovar[0].to.kol < child.kol) {
        return res.error('The responsible person does not have sufficient information regarding this product', 400);
      }

      child.sena = tovar[0].sena;
      child.summa = tovar[0].sena * child.kol;

    }

    const testTovarId = checkTovarId(childs)
    if (testTovarId) {
      return res.error('The product ID was sent incorrectly', 404);
    }

    await Jur7InternalService.createInternal({ user_id, main_schet_id, ...req.body });

    return res.success('Create doc successfully', 200);
  }

  static async getInternal(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const offset = (page - 1) * limit;
    const { data, total } = await InternalDB.getInternal([region_id, from, to, main_schet_id, offset, limit], search)
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }
    return res.status(200).json({
      message: "doc successfully get",
      meta,
      data: data || []
    })
  }

  static async getByIdInternal(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const data = await InternalDB.getByIdInternal([region_id, id, main_schet_id], true)
    if (!data) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    return res.status(201).json({
      message: "doc successfully get",
      data
    });
  }

  static async updateInternal(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, kimga_id, childs } = req.body;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const oldData = await InternalDB.getByIdInternal([region_id, id, main_schet_id])
    if (!oldData) {
      return res.error('Doc not found', 404);
    }
    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id])
    if (!responsible) {
      return res.error('Responsible not found', 404);
    }
    const responsible2 = await ResponsibleDB.getByIdResponsible([region_id, kimdan_id])
    if (!responsible2) {
      return res.error('Responsible not found', 404);
    }
    for (let child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id])
      if (!product) {
        return res.error('Poduct not found', 404);
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
      return res.error('The product ID was sent incorrectly', 404);
    }

    await Jur7InternalService.updateInternal({ ...req.body, user_id, main_schet_id, id });

    return res.success('Update doc successfully', 200);
  }

  static async deleteInternal(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }
    const internal_doc = await InternalDB.getByIdInternal([region_id, id, main_schet_id])
    if (!internal_doc) {
      return res.error('Doc not found', 404);
    }
    await db.transaction(async (client) => {
      await InternalDB.deleteInternal([id], client)
    })
    return res.status(200).json({
      message: 'delete internal doc successfully'
    })
  }
}