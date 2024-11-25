const { PereotsenkaDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');

exports.PereotsenkaService = class {
    static async createPereotsenka(req, res) {
        const { name, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12 } = req.body;

        const pereotsenka = await PereotsenkaDB.getBYNamePereotsenka([name])
        if (pereotsenka) {
            return res.status(409).json({
                message: "this data already exists"
            })
        }
        const result = await PereotsenkaDB.createPereotsenka([
            name,
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
            tashkentTime(),
            tashkentTime()
        ])
        return res.status(201).json({
            message: "Create pereotsenka successfully",
            data: result
        })
    }

    static async getPereotsenka(req, res) {
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await PereotsenkaDB.getPereotsenka([offset, limit], search)
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }
        return res.status(200).json({
            message: "pereotsenka successfully get",
            meta,
            data: data || []
        })
    }

    static async getByIdPereotsenka(req, res) {
        const id = req.params.id
        const data = await PereotsenkaDB.getByIdPereotsenka([id], true)
        if (!data) {
            return res.status(404).json({
                message: "pereotsenka not found"
            })
        }
        return res.status(201).json({
            message: "pereotsenka successfully get",
            data
        });
    }

    static async updatePereotsenka(req, res) {
        const {
            name,
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
        } = req.body;
        const id = req.params.id
        const pereotsenka = await PereotsenkaDB.getByIdPereotsenka([id])
        if (!pereotsenka) {
            return res.status(404).json({
                message: "pereotsenka not found"
            })
        }
        const result = await PereotsenkaDB.updatePereotsenka([
            name,
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
            tashkentTime(),
            id
        ])
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deletePereotsenka(req, res) {
        const id = req.params.id
        const pereotsenka = await PereotsenkaDB.getByIdPereotsenka([id])
        if (!pereotsenka) {
            return res.status(404).json({
                message: "pereotsenka not found"
            })
        }
        await PereotsenkaDB.deletePereotsenka([id])
        return res.status(200).json({
            message: 'delete pereotsenka successfully'
        })
    }

}