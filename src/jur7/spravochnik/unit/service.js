const { UnitDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');

exports.UnitService = class {
    static async createUnit(req, res) {
        const { name } = req.body;
        const check = await UnitDB.getByNameUnit([name])
        if(check){
            return res.status(409).json({
                message: "this data already exists"
            })
        }
        const result = await UnitDB.createUnit([name, tashkentTime(), tashkentTime()]);
        return res.status(201).json({
            message: "Unit created successfully",
            data: result
        });
    }

    static async getUnit(req, res) {
        const data = await UnitDB.getUnit();
        return res.status(200).json({
            message: "Units successfully fetched",
            data: data || []
        });
    }

    static async getByIdUnit(req, res) {
        const id = req.params.id;
        const data = await UnitDB.getByIdUnit([id], true);
        if (!data) {
            return res.status(404).json({
                message: "Unit not found"
            });
        }
        return res.status(200).json({
            message: "Unit successfully fetched",
            data
        });
    }

    static async updateUnit(req, res) {
        const { name } = req.body;
        const id = req.params.id;
        const old_unit = await UnitDB.getByIdUnit([id]);
        if (!old_unit) {
            return res.status(404).json({
                message: "Unit not found"
            });
        }
        if(old_unit.name !== name){
            const check = await UnitDB.getByNameUnit([name])
            if(check){
                return res.status(409).json({
                    message: "this data already exists"
                })
            }
        }
        const result = await UnitDB.updateUnit([name, tashkentTime(), id]);
        return res.status(200).json({
            message: 'Unit successfully updated',
            data: result
        });
    }

    static async deleteUnit(req, res) {
        const id = req.params.id;
        const unit = await UnitDB.getByIdUnit([id]);
        if (!unit) {
            return res.status(404).json({
                message: "Unit not found"
            });
        }
        await UnitDB.deleteUnit([id]);
        return res.status(200).json({
            message: 'Unit successfully deleted'
        });
    }
};
