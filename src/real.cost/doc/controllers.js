const { tashkentTime } = require('../../helper/functions');
const { BudjetService } = require('../../spravochnik/budjet/services');
const { SmetaGrafikService } = require('../../smeta/grafik/services');
const { db } = require('../../db/index')
const { DocService } = require('./services');

exports.Controller = class {
  static async createDoc(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const budjet_id = req.query.budjet_id;
    const { body } = req;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error('Budjet not found', 404);
    }
    const docs = await DocService.getDoc({ region_id, budjet_id }, body.year, body.month, body.type_document);
    if (docs.length) {
      return res.error('This data already exist', 409);
    }
    for (let child of body.childs) {
      const smeta_grafik = await SmetaGrafikService.getByIdSmetaGrafik(region_id, child.smeta_grafik_id);
      if (!smeta_grafik) {
        return res.error('Smeta grafik not found', 404);
      }
    }
    const result = await DocService.createDoc({ ...body, user_id, budjet_id });
    return res.status(201).json({
      message: "Create doc successfully",
      data: result
    });
  }

  static async getDoc(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error(404, "budjet not found");
    }
    const data = await DocService.getDoc({ region_id, budjet_id });
    return res.success('Doc get Successfully', 200, null, data);
  }

  static async getByIdDoc(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error(404, "budjet not found");
    }
    const doc = await DocService.getByIdDoc(region_id, budjet_id, id, true);
    if (!doc) {
      res.error('Doc not found', 404);
    }
    return res.success('Doc get suuccessfully', 200, null, doc);
  }

  static async updateDoc(req, res) {
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const id = req.params.id;
    const { body } = req;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error(404, "budjet not found");
    }
    const old_doc = await DocService.getByIdDoc(region_id, budjet_id, id);
    if (!old_doc) {
      res.error('Doc not found', 404);
    }
    if (old_doc.year !== body.year || old_doc.month !== body.month || old_doc.type_document !== body.type_document) {
      const docs = await DocService.getDoc({ region_id, budjet_id }, body.year, body.month, body.type_document);
      if (!docs.length) {
        return res.error('Doc not found', 404);
      }
    }
    for (let child of body.childs) {
      const smeta_grafik = await SmetaGrafikService.getByIdSmetaGrafik(region_id, child.smeta_grafik_id);
      if (!smeta_grafik) {
        return res.error('Smeta grafik not found', 404);
      }
    }
    const result = await DocService.updateDoc({ ...body, id, region_id });
    return res.success('Update doc successfully', 200, null, result);
  }

  static async deleteDoc(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error(404, "budjet not found");
    }
    const old_doc = await DocService.getByIdDoc(region_id, budjet_id, id, true);
    if (!old_doc) {
      res.error('Doc not found', 404);
    }
    await DocService.deleteDoc(id);
    return res.status(200).json({
      message: 'delete doc successfully'
    })
  }
}