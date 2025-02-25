const { BudjetDB } = require('@budjet/db');
const { MainBookSchetDB } = require('@main_book_schet/db');
const { MainBookSchetService } = require('@main_book_schet/service');
const { MainSchetService } = require('@main_schet/service');
const { MainBookDocService } = require('./service');
const { checkUniqueIds } = require('@helper/functions');
const { BudjetService } = require('@budjet/service');

exports.Controller = class {
  static async auto(req, res) {
    const { main_schet_id, budjet_id } = req.query;
    const region_id = req.user.region_id;

    if (budjet_id) {
      const budjet = await BudjetService.getById({ budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t('budjetNotFound'), 404);
      }
    }

    if (main_schet_id) {
      const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id })
      if (!main_schet) {
        return res.error(req.i18n.t('mainSchetNotFound'), 404);
      }
    }

    const schets = await MainBookSchetService.get({ offset: 0, limit: 99999 });

    const result = await MainBookDocService.auto({ schets: schets.data, ...req.query, region_id})

    return res.success(req.i18n.t('getSucccess'), 200, req.query, result);
  }

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
    const budjet = await BudjetDB.getById([budjet_id])
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id })
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const doc = await MainBookDocService.getByIdDoc({
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
      const operatsii = await MainBookSchetDB.getByIdMainBookSchet([child.spravochnik_main_book_schet_id])
      if (!operatsii) {
        return res.status(404).json({
          message: "operatsii not found"
        })
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
    const result = await MainBookDocService.createDoc({
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
    const budjet = await BudjetDB.getById([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const docs = await MainBookDocService.getDocs({ region_id, budjet_id, year, month, type_document })
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
    const budjet = await BudjetDB.getById([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await MainBookDocService.getByIdDoc({
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
    const budjet = await BudjetDB.getById([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id })
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const old_doc = await MainBookDocService.getByIdDoc({
      region_id,
      year: query.year,
      month: query.month,
      type_document: query.type_document,
      budjet_id
    })
    if (!old_doc) {
      return res.error(req.i18n.t('docNotFound'), 404)
    }
    if (old_doc.year !== body.year || old_doc.month !== body.month || old_doc.type_document !== body.type_document) {
      const doc = await MainBookDocService.getByIdDoc({
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
      const operatsii = await MainBookSchetDB.getByIdMainBookSchet([child.spravochnik_main_book_schet_id])
      if (!operatsii) {
        return res.error('Operatsii not found', 404);
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
    const result = await MainBookDocService.updateDoc({
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
      month,
      type_document
    } = req.query;
    const budjet = await BudjetDB.getById([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await MainBookDocService.getByIdDoc({
      region_id,
      budjet_id,
      year,
      month,
      type_document
    })
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404)
    }
    await MainBookDocService.deleteDoc({
      region_id,
      year,
      month,
      type_document,
      budjet_id
    })
    return res.success('Delete successfully', 200)
  }

  static async getBySchetSumma(req, res) {
    const region_id = req.user.region_id;
    const { year, month, budjet_id, schet_id } = req.query;
    const budjet = await BudjetDB.getById([budjet_id])
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const data = await MainBookDocService.getBySchetSumma({
      region_id,
      year,
      month,
      budjet_id,
      schet_id
    })
    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }
}