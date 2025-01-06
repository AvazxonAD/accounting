const { SmetaGrafikDB } = require('./db')
const { SmetaDB } = require('../smeta/db')
const { BudjetDB } = require('../../spravochnik/budjet/db')
const { sum } = require('../../helper/functions');
const { BudjetService } = require('../../spravochnik/budjet/services')

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
        const smeta = await SmetaDB.getByIdSmeta([smeta_id]);
        if (!smeta) {
            return res.status(404).json({
                message: "smeta not found"
            })
        }
        const budjet = await BudjetDB.getByIdBudjet([spravochnik_budjet_name_id]);
        if (!budjet) {
            return res.status(404).json({
                message: "budjet not found"
            })
        }
        const existsSmetaGrafik = await SmetaGrafikDB.getByAllSmetaGrafik([region_id, smeta_id, spravochnik_budjet_name_id, year]);
        if (existsSmetaGrafik) {
            return res.status(404).json({
                message: "this data already exists"
            })
        }
        const result = await SmetaGrafikDB.createSmetaGrafik([
            smeta_id, spravochnik_budjet_name_id, user_id,
            itogo, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6,
            oy_7, oy_8, oy_9, oy_10, oy_11, oy_12, year
        ]);
        return res.status(201).json({
            message: "created smeta grafik successfully",
            data: result
        })
    }
    static async getSmetaGrafik(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, budjet_id, operator, year } = req.query;
        if (budjet_id) {
            const budjet = await BudjetService.getByIdBudjet({ id: budjet_id })
            if (!budjet) {
                return res.error('Budjet not found', 404);
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
        } = await SmetaGrafikDB.getSmetaGrafik([region_id, offset, limit], budjet_id, operator, year);
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
        return res.status(200).json({
            message: "get smeta grafik successfully",
            meta,
            data
        })
    }

    static async getByIdSmetaGrafik(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;
        const result = await SmetaGrafikDB.getByIdSmetaGrafik([region_id, id], true);
        if (!result) {
            return res.status(404).json({
                message: "smeta grafik not found"
            })
        }
        return res.status(200).json({
            message: "smeta get successfully",
            data: result
        })
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
                return res.status(200).json({
                    message: "this informartion already exist"
                })
            }
        }
        const smeta = await SmetaDB.getByIdSmeta([smeta_id]);
        if (!smeta) {
            return res.status(404).json({
                message: "smeta not found"
            })
        }
        const budjet = await BudjetDB.getByIdBudjet([spravochnik_budjet_name_id]);
        if (!budjet) {
            return res.status(404).json({
                message: "budjet not found"
            })
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
        return res.status(200).json({
            message: "smeta grafik updagte successfully",
            data: result
        })
    }

    static async deleteSmetGrafik(req, res) {
        const id = req.params.id;
        const region_id = req.user.region_id;
        const smeta_grafik = await SmetaGrafikDB.getByIdSmetaGrafik([region_id, id]);
        if (!smeta_grafik) {
            return res.status(404).json({
                message: "smeta grafik not found"
            })
        }
        await SmetaGrafikDB.deleteSmetaGrafik([id]);
        return res.status(200).json({
            message: " delete smeta grafik successfully"
        })
    }
}
