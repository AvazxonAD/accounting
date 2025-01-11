const { IznosDB } = require('./db');
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db')
const { ResponsibleService } = require('../spravochnik/responsible/service')

exports.Controller = class {
    static async getByTovarIdIznos(req, res) {
        const region_id = req.user.region_id;
        const { product_id, responsible_id } = req.query;
        if (product_id) {
            const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, product_id]);
            if (!product) {
                return res.error('Product not found', 404);
            }
        }
        if (responsible_id) {
            const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: responsible_id });
            if (!responsible) {
                return res.error('Responsible not found', 404);
            }
        }
        const result = await IznosDB.getByTovarIdIznos([region_id], responsible_id, product_id);
        return res.success('Iznos get successfully', 200, null, result);
    }
}