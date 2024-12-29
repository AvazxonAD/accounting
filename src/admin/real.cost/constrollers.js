const { typeDocuments } = require('../../helper/data')
const { EndService } = require('./services')
const { SmetaGrafikService } = require('../../smeta/grafik/services');

exports.Controller = class {
    static async getEnd(req, res) {
        const result = await EndService.getEnd()
        return res.success('get successfully', 200, null, result);
    }

    static async getByIdEnd(req, res) {
        const region_id = req.query.region_id;
        const id = req.params.id;
        const doc = await EndService.getByIdEnd(region_id, id);
        if (!doc) {
            return res.error('doc not found', 404);
        }
        const { data: grafiks } = await SmetaGrafikService.getSmetaGrafik({
            region_id,
            offset: 0,
            limit: 9999,
            budjet_id: doc.budjet_id,
            operator: ">"
        })
        doc.childs = await EndService.getEndChilds(doc, grafiks);
        return res.success('get successfully', 200, null, doc);
    }

    static async updateEnd(req, res) {
        const id = req.params.id;
        const user_id = req.user.id;
        const region_id = req.query.region_id;
        const doc = await EndService.getByIdEnd(region_id, id);
        if (!doc) {
            return res.error('doc not found', 404);
        }
        const data = await EndService.updateEnd({user_id, id, status: req.body.status});
        return res.success('update successfully', 200, null, data);
    }
}