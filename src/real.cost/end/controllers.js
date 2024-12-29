const { EndService } = require('./services');
const { BudjetService } = require('../../spravochnik/budjet/services');
const { SmetaGrafikService } = require('../../smeta/grafik/services');

exports.Controller = class {
  static async createEnd(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const { body } = req;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const docs = await EndService.getEnd({ region_id, budjet_id }, body.year, body.month);
    if (docs.length) {
      return res.error('This data already exists', 409);
    }
    for (let type of body.data) {
      for (let grafik of type.grafiks) {
        const smeta_grafik = await SmetaGrafikService.getByIdSmetaGrafik(region_id, grafik.id);
        if (!smeta_grafik) {
          return res.status(404).json({
            message: "smeta_grafik not found"
          })
        }
      }
    }
    const result = await EndService.createEnd({ ...body, user_id, budjet_id });
    return res.success("create successfully", 201, null, result);
  };

  static async getEnd(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const data = await EndService.getEnd({ region_id, budjet_id });
    return res.success('data get successfully', 200, null, data);
  };

  static async getByIdEnd(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await EndService.getByIdEnd({ region_id, budjet_id, id }, true)
    if (!doc) {
      return res.error("doc not found", 404);
    }
    const { data: grafiks } = await SmetaGrafikService.getSmetaGrafik({
      region_id,
      offset: 0,
      limit: 9999,
      budjet_id: budjet_id,
      operator: ">"
    });
    const result = await EndService.getEndChild(grafiks, doc);
    return res.success('get successfully', 200, null, result);
  };

  static async updateEnd(req, res) {
    const id = req.params.id;
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const user_id = req.user.id;
    const { body } = req;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const old_doc = await EndService.getByIdEnd({ region_id, budjet_id, id })
    if (!old_doc) {
      return res.error("old_doc not found", 404);
    }
    if (old_doc.status === 2) {
      return res.error("The confirmed document cannot be deleted", 400);
    }
    if (old_doc.year !== body.year || old_doc.month !== body.month) {
      const docs = await EndService.getEnd({ region_id, budjet_id }, body.year, body.month);
      if (docs.length) {
        return res.error('This data already exists', 409);
      }
    }
    for (let type of body.data) {
      for (let grafik of type.grafiks) {
        const smeta_grafik = await SmetaGrafikService.getByIdSmetaGrafik(region_id, grafik.id);
        if (!smeta_grafik) {
          return res.status(404).json({
            message: "smeta_grafik not found"
          })
        }
      }
    };
    const result = await EndService.updateEnd({ ...body, id, user_id})
    return res.success('update successfully', 200, null, result);
  };

  static async deleteEnd(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetService.getByIdBudjet(budjet_id);
    if (!budjet) {
      return res.error('Budjet not found', 404)
    }
    const doc = await EndService.getByIdEnd({ region_id, budjet_id, id })
    if (!doc) {
      return res.error("doc not found", 404);
    }
    if (doc.status === 2) {
      return res.error("The confirmed document cannot be deleted", 400);
    }
    await EndService.deleteEnd(id);
    return res.success('delete successfully', 200, null, null);
  };

  static async getInfo(req, res) {
    const region_id = req.user.region_id;
    const { query } = req;
    const budjet = await BudjetService.getByIdBudjet(query.budjet_id);
    if (!budjet) {
      return res.error('Budjet not found', 404)
    };
    const { data: grafiks } = await SmetaGrafikService.getSmetaGrafik({
      region_id,
      offset: 0,
      limit: 9999,
      budjet_id: query.budjet_id,
      operator: ">"
    });
    const result = await EndService.getInfo(grafiks, { ...query });
    return res.success("Get info successfully", 200, null, result);
  };
};