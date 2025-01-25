const { BudjetDB } = require('../../spravochnik/budjet/db');
const { MainSchetService } = require('../../spravochnik/main.schet/services');
const { SmetaGrafikService } = require('../../smeta/grafik/services')
const { DocRealCostService } = require('./service');
const { checkUniqueIds } = require('../../helper/functions');


exports.Controller = class {
  static async createDoc(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const budjet_id = req.query.budjet_id;
    const main_schet_id = req.query.main_schet_id;
    const {
      month,
      year,
      type_document,
      childs
    } = req.body;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404);
    }
    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id })
    if (!main_schet) {
      return res.error(`${req.i18n.t('notFound', { replace: { data: 'Main schet' } })}`, 404);
    }
    const doc = await DocRealCostService.getByIdDoc({
      region_id,
      budjet_id,
      year,
      month,
      type_document
    })
    if (doc) {
      return res.error('This data already exist', 409);
    }
    for (let child of childs) {
      const smeta_grafik = await SmetaGrafikService.getByIdSmetaGrafik({ region_id, id: child.smeta_grafik_id })
      if (!smeta_grafik) {
        return res.error('Smeta grafik not found', 404)
      }
      if (type_document === 'start' || type_document === 'end') {
        if (child.debet_sum > 0 && child.kredit_sum > 0) {
          return res.error(`Only either debit or credit amount can be provided, not both`, 400)
        }
      }
    }
    if (!checkUniqueIds(childs)) {
      return res.error('Duplicate id found in schets', 400);
    }
    const result = await DocRealCostService.createDoc({
      user_id,
      budjet_id,
      main_schet_id,
      type_document,
      month,
      year,
      childs,
      region_id
    })
    return res.status(201).json({
      message: "Create doc successfully",
      data: result
    })
  }

  static async getDoc(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, year, month, type_document } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const docs = await DocRealCostService.getDocs({ region_id, budjet_id, year, month, type_document })
    return res.success('Get successfully', 200, null, docs);
  }

  static async getByIdDoc(req, res) {
    const region_id = req.user.region_id
    const {
      budjet_id,
      year,
      month,
      type_document
    } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await DocRealCostService.getByIdDoc({
      region_id,
      budjet_id,
      year,
      month,
      type_document
    })
    if (!doc) {
      return res.error('doc not found', 404)
    }
    return res.success('doc successfully get', 200, null, doc);
  }

  static async updateDoc(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const budjet_id = req.query.budjet_id;
    const main_schet_id = req.query.main_schet_id;
    const { query } = req;
    const { body } = req;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id })
    if (!main_schet) {
      return res.error(`${req.i18n.t('notFound', { replace: { data: 'Main schet' } })}`, 404);
    }
    const old_doc = await DocRealCostService.getByIdDoc({
      region_id,
      year: query.year,
      month: query.month,
      type_document: query.type_document,
      budjet_id
    })
    if (!old_doc) {
      return res.error('doc not found', 404)
    }
    if (old_doc.year !== body.year || old_doc.month !== body.month || old_doc.type_document !== body.type_document) {
      const doc = await DocRealCostService.getByIdDoc({
        region_id,
        budjet_id,
        year: body.year,
        month: body.month,
        type_document: body.type_document
      })
      if (doc) {
        return res.error('This data already exist', 409);
      }
    }
    for (let child of body.childs) {
      const smeta_grafik = await SmetaGrafikService.getByIdSmetaGrafik({ region_id, id: child.smeta_grafik_id })
      if (!smeta_grafik) {
        return res.error('Smeta grafik not found', 404)
      }
      if (body.type_document === 'start' || body.type_document === 'end') {
        if (child.debet_sum > 0 && child.kredit_sum > 0) {
          return res.error(`Only either debit or credit amount can be provided, not both`, 400)
        }
      }
    }
    if (!checkUniqueIds(body.childs)) {
      return res.error('Duplicate id found in schets', 400);
    }
    const result = await DocRealCostService.updateDoc({
      user_id,
      budjet_id,
      main_schet_id,
      region_id,
      query,
      body
    })
    return res.success('UPDATE successfully', 200, null, result)
  }

  static async deleteDoc(req, res) {
    const region_id = req.user.region_id
    const {
      budjet_id,
      year,
      month,
      type_document
    } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await DocRealCostService.getByIdDoc({
      region_id,
      budjet_id,
      year,
      month,
      type_document
    })
    if (!doc) {
      return res.error('doc not found', 404)
    }
    await DocRealCostService.deleteDoc({
      region_id,
      year,
      month,
      type_document,
      budjet_id
    })
    return res.success('Delete successfully', 200)
  }

  static async getByGrafikSumma(req, res) {
    const region_id = req.user.region_id;
    const { year, month, budjet_id, schet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const data = await DocRealCostService.getByGrafikSumma({
      region_id,
      year,
      month,
      budjet_id,
      schet_id
    })
    return res.success('Get successfully', 200, null, data);
  }
}