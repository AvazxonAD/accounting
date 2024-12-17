const { SmetaDB } = require('.././../../smeta/smeta/db');
const { GroupDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');
const { PereotsenkaDB } = require('../pereotsenka/db')
const xlsx = require('xlsx')

exports.GroupService = class {
    static async createGroup(req, res) {
        const {
            smeta_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            group_number,
            provodka_kredit,
            provodka_subschet,
            roman_numeral,
            pod_group
        } = req.body;

        const smeta = await SmetaDB.getByIdSmeta([smeta_id]);
        if (!smeta) {
            return res.status(404).json({
                message: "Smeta not found"
            });
        }
        const result = await GroupDB.createGroup([
            smeta_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            group_number,
            provodka_kredit,
            provodka_subschet,
            roman_numeral,
            pod_group,
            tashkentTime(),
            tashkentTime()
        ]);
        return res.status(201).json({
            message: "Create group successfully",
            data: result
        });
    }

    static async getGroup(req, res) {
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await GroupDB.getGroup([offset, limit], search);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        };
        return res.status(200).json({
            message: "Group successfully retrieved",
            meta,
            data: data || []
        });
    }

    static async getByIdGroup(req, res) {
        const id = req.params.id;
        const data = await GroupDB.getByIdGroup([id], true);
        if (!data) {
            return res.status(404).json({
                message: "Group not found"
            });
        }
        return res.status(200).json({
            message: "Group successfully retrieved",
            data
        });
    }

    static async updateGroup(req, res) {
        const {
            smeta_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            group_number,
            provodka_kredit,
            provodka_subschet,
            roman_numeral,
            pod_group
        } = req.body;
        const id = req.params.id;
        const group = await GroupDB.getByIdGroup([id]);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }
        const smeta = await SmetaDB.getByIdSmeta([smeta_id]);
        if (!smeta) {
            return res.status(404).json({
                message: "Smeta not found"
            });
        }
        const result = await GroupDB.updateGroup([
            smeta_id,
            name,
            schet,
            iznos_foiz,
            provodka_debet,
            group_number,
            provodka_kredit,
            provodka_subschet,
            roman_numeral,
            pod_group,
            tashkentTime(),
            id
        ]);
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deleteGroup(req, res) {
        const id = req.params.id;
        const group = await GroupDB.getByIdGroup([id]);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }
        await GroupDB.deleteGroup([id]);
        return res.status(200).json({
            message: 'Delete group successfully'
        });
    }

    static async getGroupWithPercent(req, res) {
        const data = await GroupDB.getGroupWithPercent()
        for (let item of data) {
            const percent = await PereotsenkaDB.getByGroupId([item.id])
            item.percent = percent?.pereotsenka_foiz || 0
        }
        return res.status(200).json({
            message: "get group successfully",
            data
        })
    }

    static async importExcel(req, res) {
        if (!req.file) {
            return res.status(400).json({
                message: "file not found"
            })
        }
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet).map((row) => {
            const newRow = {};
            for (const key in row) {
                newRow[key.trim()] = row[key];
            }
            return newRow;
        });
        for (let group of data) {
            await GroupDB.createGroup([
                null, 
                group.name ? group.name : '', 
                group.schet ? group.schet : '', 
                group.iznos_foiz ? group.iznos_foiz : 0, 
                group.provodka_debet ? group.provodka_debet : '', 
                group.group_number ? group.group_number.replace(/\s+/g, '') : '',
                group.provodka_kredit ? group.provodka_kredit : '',
                group.provodka_subschet ? group.provodka_subschet : '',
                group.roman_numeral ? group.roman_numeral : '',
                group.pod_group ? group.pod_group : '',
                tashkentTime(), 
                tashkentTime()
            ])
        }
        return res.status(200).json({
            message: "import data successfully"
        })
    }
};