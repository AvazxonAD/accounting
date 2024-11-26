const { PodrazdelenieDB } = require('../podrazdelenie/db');
const { ResponsibleDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');

exports.ResponsibleService = class {
    static async createResponsible(req, res) {
        const { id: user_id, region_id } = req.user
        const { spravochnik_podrazdelenie_jur7_id, fio } = req.body;
        
        const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, spravochnik_podrazdelenie_jur7_id])
        if (!podrazdelenie) {
            return res.status(404).json({
                message: "podrazdelenie not found"
            })
        }
        const result = await ResponsibleDB.createResponsible([
            spravochnik_podrazdelenie_jur7_id,
            fio,
            user_id,
            tashkentTime(),
            tashkentTime()
        ])
        return res.status(201).json({
            message: "Create responsible successfully",
            data: result
        })
    }

    static async getResponsible(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await ResponsibleDB.getResponsible([region_id, offset, limit], search)
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }
        return res.status(200).json({
            message: "responsible successfully get",
            meta,
            data: data || []
        })
    }

    static async getByIdResponsible(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await ResponsibleDB.getByIdResponsible([region_id, id], true)
        if (!data) {
            return res.status(404).json({
                message: "responsible not found"
            })
        }
        return res.status(201).json({
            message: "responsible successfully get",
            data
        });
    }

    static async updateResponsible(req, res) {
        const region_id = req.user.region_id
        const { spravochnik_podrazdelenie_jur7_id, fio } = req.body;
        const id = req.params.id
        const responsible = await ResponsibleDB.getByIdResponsible([region_id, id])
        if (!responsible) {
            return res.status(404).json({
                message: "responsible not found"
            })
        }
        const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, spravochnik_podrazdelenie_jur7_id])
        if (!podrazdelenie) {
            return res.status(404).json({
                message: "podrazdelenie not found"
            })
        }
        const result = await ResponsibleDB.updateResponsible([
            fio, 
            tashkentTime(), 
            spravochnik_podrazdelenie_jur7_id,
            id
        ])
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deleteResponsible(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const responsible = await ResponsibleDB.getByIdResponsible([region_id, id])
        if (!responsible) {
            return res.status(404).json({
                message: "responsible not found"
            })
        }
        await ResponsibleDB.deleteResponsible([id])
        return res.status(200).json({
            message: 'delete responsible successfully'
        })
    }

}