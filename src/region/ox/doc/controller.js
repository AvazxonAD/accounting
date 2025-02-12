const { BudjetService } = require('@budjet/db');
const { MainSchetService } = require('@main_schet/service')
const { OxDocService } = require('./service')
const { checkUniqueIds } = require('@helper/functions')
const { SmetaGrafikService } = require('@smeta_grafik/service')


exports.Controller = class {
  static async createDoc(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const budjet_id = req.query.budjet_id;
    const main_schet_id = req.query.main_schet_id;
    const {
      month,
      year,
      childs
    } = req.body;
    const budjet = await BudjetService.getById({ id: budjet_id })
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id })
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const doc = await OxDocService.getByIdDoc({ region_id, budjet_id, year, month });
    if (doc) {
      return res.error('This data already exist', 409);
    }
    if (!checkUniqueIds(childs)) {
      return res.error('Duplicate id found in smetas', 400);
    }
    for (let child of childs) {
      const smeta = await SmetaGrafikService.getByIdSmetaGrafik({ region_id, id: child.smeta_grafik_id });
      if (!smeta) {
        return res.error('Smeta not found', 404);
      }
      child.ajratilgan_mablag = smeta[`oy_${month}`];
    }
    const result = await OxDocService.createDoc({
      user_id,
      main_schet_id,
      budjet_id,
      month,
      year,
      region_id,
      childs
    })
    return res.success('Create successfully', 201, null, result);
  }

  static async getDoc(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, year, month } = req.query;
    const budjet = await BudjetService.getById({ id: budjet_id })
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const docs = await OxDocService.getDocs({ region_id, budjet_id, year, month })
    return res.success(req.i18n.t('getSuccess'), 200, null, docs);
  }

  static async getByIdDoc(req, res) {
    const region_id = req.user.region_id
    const {
      budjet_id,
      year,
      month,
      type_document
    } = req.query;
    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await OxDocService.getByIdDoc({
      region_id,
      budjet_id,
      year,
      month,
      type_document
    })
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404)
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
    const budjet = await BudjetService.getById({ id: budjet_id })
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id })
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const old_doc = await OxDocService.getByIdDoc({
      region_id,
      year: query.year,
      month: query.month,
      budjet_id
    })
    if (!old_doc) {
      return res.error(req.i18n.t('docNotFound'), 404)
    }
    if (old_doc.year !== body.year || old_doc.month !== body.month) {
      const doc = await OxDocService.getByIdDoc({
        region_id,
        budjet_id,
        year: body.year,
        month: body.month,
      })
      if (doc) {
        return res.error('This data already exist', 409);
      }
    }
    if (!checkUniqueIds(body.childs)) {
      return res.error('Duplicate id found in smetas', 400);
    }
    for (let child of body.childs) {
      const smeta = await SmetaGrafikService.getByIdSmetaGrafik({ region_id, id: child.smeta_grafik_id });
      if (!smeta) {
        return res.error('Smeta not found', 404);
      }
      child.ajratilgan_mablag = smeta[`oy_${body.month}`];
    }
    const result = await OxDocService.updateDoc({
      user_id,
      budjet_id,
      main_schet_id,
      region_id,
      query,
      body
    })
    return res.success(req.i18n.t('updateSuccess'), 200, null, result)
  }

  static async deleteDoc(req, res) {
    const region_id = req.user.region_id
    const {
      budjet_id,
      year,
      month
    } = req.query;
    const budjet = await BudjetService.getById({ id: budjet_id })
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await OxDocService.getByIdDoc({
      region_id,
      budjet_id,
      year,
      month
    })
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404)
    }
    await OxDocService.deleteDoc({
      region_id,
      year,
      month,
      budjet_id
    })
    return res.success('Delete successfully', 200)
  }

  static async getByGrafikSumma(req, res) {
    const region_id = req.user.region_id;
    const { year, month, budjet_id, schet_id } = req.query;
    const budjet = await BudjetService.getById({ id: budjet_id })
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const data = await OxDocService.getByGrafikSumma({
      region_id,
      year,
      month,
      budjet_id,
      schet_id
    })
    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }
}