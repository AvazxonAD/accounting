const { PereotsenkaDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { GroupDB } = require('../group/db')


exports.PereotsenkaService = class {
    static async createPereotsenka(req, res) {
        const { name, pereotsenka_foiz, group_jur7_id } = req.body;

        const existingPereotsenka = await PereotsenkaDB.getBYNamePereotsenka([name]);
        if (existingPereotsenka) {
            return res.status(409).json({
                message: "This data already exists"
            });
        }

        const group = await GroupDB.getByIdGroup([group_jur7_id])
        if (!group) {
            return res.status(404).json({
                message: "group not found"
            })
        }

        const result = await PereotsenkaDB.createPereotsenka([
            name,
            group_jur7_id,
            pereotsenka_foiz,
            tashkentTime(),
            tashkentTime()
        ]);

        return res.status(201).json({
            message: "Create pereotsenka successfully",
            data: result
        });
    }

    static async getPereotsenka(req, res) {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await PereotsenkaDB.getPereotsenka([offset, limit], search);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        };

        return res.status(200).json({
            message: "Pereotsenka successfully retrieved",
            meta,
            data: data || []
        });
    }

    static async getByIdPereotsenka(req, res) {
        const { id } = req.params;
        const data = await PereotsenkaDB.getByIdPereotsenka([id], true);
        if (!data) {
            return res.status(404).json({
                message: "Pereotsenka not found"
            });
        }

        return res.status(200).json({
            message: "Pereotsenka successfully retrieved",
            data
        });
    }

    static async updatePereotsenka(req, res) {
        const { name, pereotsenka_foiz, group_jur7_id } = req.body;
        const { id } = req.params;

        const existingPereotsenka = await PereotsenkaDB.getByIdPereotsenka([id]);
        if (!existingPereotsenka) {
            return res.status(404).json({
                message: "Pereotsenka not found"
            });
        }

        if(existingPereotsenka.group_jur7_id !== group_jur7_id){
            const group = await GroupDB.getByIdGroup(group_jur7_id)
            if(!group){
                return res.status(404).json({
                    message: "group not found"
                })
            } 
        }

        const result = await PereotsenkaDB.updatePereotsenka([
            name,
            group_jur7_id,
            pereotsenka_foiz,
            tashkentTime(),
            id
        ]);

        return res.status(200).json({
            message: "Update successful",
            data: result
        });
    }

    static async deletePereotsenka(req, res) {
        const { id } = req.params;

        const existingPereotsenka = await PereotsenkaDB.getByIdPereotsenka([id]);
        if (!existingPereotsenka) {
            return res.status(404).json({
                message: "Pereotsenka not found"
            });
        }

        await PereotsenkaDB.deletePereotsenka([id]);
        return res.status(200).json({
            message: "Delete pereotsenka successfully"
        });
    }
};
