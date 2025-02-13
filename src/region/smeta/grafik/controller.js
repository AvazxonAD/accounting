const { SmetaGrafikDB } = require('./db')
const { SmetaDB } = require('../smeta/db')
const { BudjetDB } = require('@budjet/db')
const { sum } = require('@helper/functions');
const { BudjetService } = require('@budjet/service');

exports.Controller = class {
    static async createSmetaGrafik(req, res) {
        const region_id = req.user.region_id;
        const user_id = req.user.id;
        const {
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
            oy_12,
            smeta_id,
            spravochnik_budjet_name_id,
            year
        } = req.body
        const itogo = sum(
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

        const smeta = await SmetaDB.getById([smeta_id]);
        if (!smeta) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
        }

        const budjet = await BudjetDB.getById([spravochnik_budjet_name_id]);
        if (!budjet) {
            return res.error(req.i18n.t('budjetNotFound'));
        }

        const existsSmetaGrafik = await SmetaGrafikDB.getByAllSmetaGrafik([region_id, smeta_id, spravochnik_budjet_name_id, year]);
        if (existsSmetaGrafik) {
            return res.error(req.i18n.t('docExists'), 409);
        }

        const result = await SmetaGrafikDB.createSmetaGrafik([
            smeta_id, spravochnik_budjet_name_id, user_id,
            itogo, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6,
            oy_7, oy_8, oy_9, oy_10, oy_11, oy_12, year
        ]);

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }
    static async getSmetaGrafik(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, budjet_id, operator, year, search } = req.query;
        if (budjet_id) {
            const budjet = await BudjetService.getById({ id: budjet_id })
            if (!budjet) {
                return res.error(req.i18n.t('budjetNotFound'), 404);
            }
        }

        const offset = (page - 1) * limit;
        const {
            data,
            total,
            itogo,
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
        } = await SmetaGrafikDB.getSmetaGrafik([region_id, offset, limit], budjet_id, operator, year, search);

        const pageCount = Math.ceil(total / limit);

        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            itogo,
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
            oy_12,
        }

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async getByIdSmetaGrafik(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;

        const result = await SmetaGrafikDB.getByIdSmetaGrafik([region_id, id], true);
        if (!result) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
        }

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }

    static async updateSmetaGrafik(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;
        const {
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
            oy_12,
            smeta_id,
            spravochnik_budjet_name_id,
            year
        } = req.body
        const old_data = await SmetaGrafikDB.getByIdSmetaGrafik([region_id, id]);
        if (old_data.smeta_id !== smeta_id || old_data.spravochnik_budjet_name_id !== spravochnik_budjet_name_id || old_data.year !== year) {
            const existsSmetaGrafik = await SmetaGrafikDB.getByAllSmetaGrafik([region_id, smeta_id, spravochnik_budjet_name_id, year]);
            if (existsSmetaGrafik) {
                return res.error(req.i18n.t('docExists'), 409);
            }
        }
        const smeta = await SmetaDB.getById([smeta_id]);
        if (!smeta) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
        }
        const budjet = await BudjetDB.getById([spravochnik_budjet_name_id]);
        if (!budjet) {
            return res.error(req.i18n.t('budjetNotFound'));
        }
        const itogo = sum(
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
        const result = await SmetaGrafikDB.updateSmetaGrafik([
            itogo, oy_1, oy_2, oy_3,
            oy_4, oy_5, oy_6, oy_7,
            oy_8, oy_9, oy_10, oy_11, oy_12,
            smeta_id, spravochnik_budjet_name_id, year, id
        ]);

        return res.success(req.i18n.t('updateSuccess'), 200, null, result);
    }

    static async deleteSmetGrafik(req, res) {
        const id = req.params.id;
        const region_id = req.user.region_id;
        const smeta_grafik = await SmetaGrafikDB.getByIdSmetaGrafik([region_id, id]);
        if (!smeta_grafik) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
        }

        const result = await SmetaGrafikDB.deleteSmetaGrafik([id]);

        return res.success(req.i18n.t('deleteSuccess'), 200, null, result)
    }
}
