const { PodrazdelenieDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');

exports.PodrazdelenieService = class {
    static async createPodrazdelenie(req, res) {
        const user_id = req.user.id;
        const { name } = req.body;
        const check = await PodrazdelenieDB.getByNamePodrazdelenie([region_id, name])
        if(check){
            return res.status(409).json({
                message: "this data already exists"
            })
        }
        const result = await PodrazdelenieDB.createPodrazdelenie([
            user_id,
            name,
            tashkentTime(),
            tashkentTime()
        ])
        return res.status(201).json({
            message: "Create podrazdelenie successfully",
            data: result
        })
    }

    static async getPodrazdelenie(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await PodrazdelenieDB.getPodrazdelenie([region_id, offset, limit], search)
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }
        return res.status(200).json({
            message: "podrazdelenie successfully get",
            meta,
            data: data || []
        })
    }

    static async getByIdPodrazdelenie(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, id], true)
        if (!data) {
            return res.status(404).json({
                message: "podrazdelenie not found"
            })
        }
        return res.status(201).json({
            message: "podrazdelenie successfully get",
            data
        });
    }

    static async updatePodrazdelenie(req, res) {
        const region_id = req.user.region_id
        const { name } = req.body;
        const id = req.params.id
        const old_podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, id])
        if (!old_podrazdelenie) {
            return res.status(404).json({
                message: "podrazdelenie not found"
            })
        }
        const result = await PodrazdelenieDB.updatePodrazdelenie([
            name,
            tashkentTime(),
            id
        ])
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deletePodrazdelenie(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, id])
        if (!podrazdelenie) {
            return res.status(404).json({
                message: "podrazdelenie not found"
            })
        }
        await PodrazdelenieDB.deletePodrazdelenie([id])
        return res.status(200).json({
            message: 'delete podrazdelenie successfully'
        })
    }

}