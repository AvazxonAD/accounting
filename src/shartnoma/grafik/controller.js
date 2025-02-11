const { GrafikService } = require('./service');
const { BudjetService } = require('../../spravochnik/budjet/service');
const { HelperFunctions } = require('../../helper/functions');

exports.Controller = class {
    static async create(req, res) {
        const region_id = req.user.region_id;
        const budjet_id = req.query.budjet_id;
        const id = req.params.id;
        const user_id = req.user.id;

        const budjet = await BudjetService.getById({ id: budjet_id });
        if (!budjet) {
            return res.error(req.i18n.t('budjetNotFound'), 404);
        }

        const { smeta_id, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12 } = data
        const summa = HelperFunctions.sum(
            oy_1,
            oy_2,
            oy_3,
            oy_4,
            oy_5,
            oy_6,
            oy_7,
            oy_8,
            oy_9,
            oy_10,
            oy_11,
            oy_12
        );


        const result = await GrafikService.create({ ...data, id, summa, user_id, smeta_id });
    }
}