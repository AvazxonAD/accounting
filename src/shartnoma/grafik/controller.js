const { GrafikService } = require('./service');
const { BudjetService } = require('../../spravochnik/budjet/service');
const { HelperFunctions } = require('../../helper/functions');
const { SmetaService } = require('../../smeta/smeta/service');
const { ContractService } = require('../contract/service');

exports.Controller = class {
    static async create(req, res) {
        const budjet_id = req.query.budjet_id;
        const user_id = req.user.id;
        const region_id = req.user.region_id;

        const budjet = await BudjetService.getById({ id: budjet_id });
        if (!budjet) {
            return res.error(req.i18n.t('budjetNotFound'), 404);
        }

        const { smeta_id, id_shartnomalar_organization, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12 } = req.body;

        const smeta = await SmetaService.getById({ id: smeta_id });
        if (!smeta) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
        }

        const contract = await ContractService.getById({ region_id, id: id_shartnomalar_organization });
        if (!contract) {
            return res.error(req.i18n.t('contractNotFound'), 404);
        }

        const grafik_summa = await GrafikService.getSummaByContractId({ contract_id: id_shartnomalar_organization });

        const summa = HelperFunctions.sum(oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12);

        const result = await GrafikService.create({ ...req.body, summa, user_id, budjet_id, contract, grafik_summa });

        return res.success(req.i18n.t('createSuccces'), 201, result.contract, result.grafik);
    }

    static async update(req, res) {
        const budjet_id = req.query.budjet_id;
        const id = req.params.id;
        const user_id = req.user.id;
        const region_id = req.user.region_id;

        const oldData = await GrafikService.getById({ budjet_id, region_id, id });
        if (!oldData) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }

        const budjet = await BudjetService.getById({ id: budjet_id });
        if (!budjet) {
            return res.error(req.i18n.t('budjetNotFound'), 404);
        }

        const { smeta_id, id_shartnomalar_organization, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12 } = req.body;

        const smeta = await SmetaService.getById({ id: smeta_id });
        if (!smeta) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
        }

        const contract = await ContractService.getById({ region_id, id: id_shartnomalar_organization });
        if (!contract) {
            return res.error(req.i18n.t('contractNotFound'), 404);
        }

        const summa = HelperFunctions.sum(oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12);

        const grafik_summa = await GrafikService.getSummaByContractId({ contract_id: id_shartnomalar_organization });

        const result = await GrafikService.update({ ...req.body, id, summa, user_id, budjet_id, contract, oldData, grafik_summa });

        return res.success(req.i18n.t('createSuccces'), 201, result.contract, result.grafik);
    }
}