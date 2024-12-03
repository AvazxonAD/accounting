const { NaimenovanieDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');
const { BudjetDB } = require('../../../spravochnik/budjet/db')
const { GroupDB } = require('../group/db')
const { ResponsibleDB } = require('../responsible/db')

exports.NaimenovanieService = class {
    static async createNaimenovanie(req, res) {
        const user_id = req.user.id
        const region_id = req.user.region_id
        const {
            spravochnik_budjet_name_id,
            name,
            edin,
            group_jur7_id
        } = req.body;

        const bedjet = await BudjetDB.getByIdBudjet([spravochnik_budjet_name_id])
        if (!bedjet) {
            return res.status(404).json({
                message: "bedjet not found"
            })
        }
        const group = await GroupDB.getByIdGroup([group_jur7_id])
        if (!group) {
            return res.status(404).json({
                message: "group not found"
            })
        }
        const result = await NaimenovanieDB.createNaimenovanie([
            user_id,
            spravochnik_budjet_name_id,
            name,
            edin,
            group_jur7_id,
            tashkentTime(),
            tashkentTime()
        ])
        return res.status(201).json({
            message: "Create naimenovanie successfully",
            data: result
        })
    }

    static async getNaimenovanie(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await NaimenovanieDB.getNaimenovanie([region_id, offset, limit], search)
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }
        return res.status(200).json({
            message: "naimenovanie successfully get",
            meta,
            data: data || []
        })
    }

    static async getByIdNaimenovanie(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await NaimenovanieDB.getByIdNaimenovanie([region_id, id], true)
        if (!data) {
            return res.status(404).json({
                message: "naimenovanie not found"
            })
        }
        return res.status(201).json({
            message: "naimenovanie successfully get",
            data
        });
    }

    static async updateNaimenovanie(req, res) {
        const region_id = req.user.region_id
        const {
            spravochnik_budjet_name_id,
            name,
            edin,
            group_jur7_id
        } = req.body;
        const id = req.params.id
        const old_naimenovanie = await NaimenovanieDB.getByIdNaimenovanie([region_id, id])
        if (!old_naimenovanie) {
            return res.status(404).json({
                message: "naimenovanie not found"
            })
        }
        const bedjet = await BudjetDB.getByIdBudjet([spravochnik_budjet_name_id])
        if (!bedjet) {
            return res.status(404).json({
                message: "bedjet not found"
            })
        }
        const proup = await GroupDB.getByIdGroup([group_jur7_id])
        if (!proup) {
            return res.status(404).json({
                message: "proup not found"
            })
        }
        const result = await NaimenovanieDB.updateNaimenovanie([
            name,
            edin,
            spravochnik_budjet_name_id,
            group_jur7_id,
            tashkentTime(),
            id
        ])
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deleteNaimenovanie(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const naimenovanie = await NaimenovanieDB.getByIdNaimenovanie([region_id, id])
        if (!naimenovanie) {
            return res.status(404).json({
                message: "naimenovanie not found"
            })
        }
        await NaimenovanieDB.deleteNaimenovanie([id])
        return res.status(200).json({
            message: 'delete naimenovanie successfully'
        })
    }

    static async getProductKol(req, res) {
        const { kimdan_id, search } = req.query;
        const region_id = req.user.region_id;
        const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimdan_id])
        if(!responsible){
            return res.status(404).json({
                message: "responsible not found"
            })
        } 
        const data = await NaimenovanieDB.getProductKol([region_id, kimdan_id], search)
        const result = data.filter(item => item.result > 0)
        return res.status(200).json({
            message: "product get succcessfully!",
            data: result
        })
    }
}