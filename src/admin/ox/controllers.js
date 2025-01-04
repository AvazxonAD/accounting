const { BudjetService } = require('../../spravochnik/budjet/services');
const { DocService } = require('./services');

exports.Controller = class {
  static async getDoc(req, res) {
    const data = await DocService.getDoc({});
    return res.success('Doc get Successfully', 200, null, data);
  }

  static async getByIdDoc(req, res) {
    const id = req.params.id;
    const doc = await DocService.getByIdDoc(id);
    if (!doc) {
      res.error('Doc not found', 404);
    }
    return res.success('Doc get suuccessfully', 200, null, doc);
  }

  static async confirmDoc(req, res) {
    const user_id = req.user.id
    const id = req.params.id;
    const old_doc = await DocService.getByIdDoc(id);
    if (!old_doc) {
      res.error('Doc not found', 404);
    }
    await DocService.confirmDoc({ user_id, status: req.body.status, id })
    return res.success('Confirm doc successfully', 200, null, null);
  }
}