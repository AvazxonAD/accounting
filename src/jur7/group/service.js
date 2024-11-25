const { PereotsenkaDB } = require('./../pereotsenka/db');
const { GroupDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');

exports.GroupService = class {
    static async createGroup(req, res) {
        const user_id = req.user.id
        const {
            pereotsenka_jur7_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            provodka_subschet,
            provodka_kredit
        } = req.body;

        const pereotsenka = await PereotsenkaDB.getByIdPereotsenka([pereotsenka_jur7_id])
        if (!pereotsenka) {
            return res.status(404).json({
                message: "pereotsenka not found"
            })
        }
        const result = await GroupDB.createGroup([
            pereotsenka_jur7_id,
            user_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            provodka_subschet,
            provodka_kredit,
            tashkentTime(),
            tashkentTime()
        ])
        return res.status(201).json({
            message: "Create group successfully",
            data: result
        })
    }

    static async getGroup(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await GroupDB.getGroup([region_id, offset, limit], search)
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }
        return res.status(200).json({
            message: "group successfully get",
            meta,
            data: data || []
        })
    }

    static async getByIdGroup(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await GroupDB.getByIdGroup([region_id, id], true)
        if (!data) {
            return res.status(404).json({
                message: "group not found"
            })
        }
        return res.status(201).json({
            message: "group successfully get",
            data
        });
    }

    static async updateGroup(req, res) {
        const region_id = req.user.region_id
        const {
            pereotsenka_jur7_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            provodka_subschet,
            provodka_kredit
        } = req.body;
        const id = req.params.id
        const group = await GroupDB.getByIdGroup([region_id, id])
        if (!group) {
            return res.status(404).json({
                message: "group not found"
            })
        }
        const pereotsenka = await PereotsenkaDB.getByIdPereotsenka([pereotsenka_jur7_id])
        if (!pereotsenka) {
            return res.status(404).json({
                message: "pereotsenka not found"
            })
        }
        const result = await GroupDB.updateGroup([
            pereotsenka_jur7_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            provodka_subschet,
            provodka_kredit,
            tashkentTime(),
            id
        ])
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }
    
    static async deleteGroup(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const group = await GroupDB.getByIdGroup([region_id, id])
        if(!group){
            return res.status(404).json({
                message: "group not found"
            })
        }
        await GroupDB.deleteGroup([id])
        return res.status(200).json({
            message: 'delete group successfully'
        })
    }

}