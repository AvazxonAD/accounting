const { SmetaDB } = require('../../../smeta/smeta/db');
const { GroupDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');
const { PereotsenkaDB } = require('../pereotsenka/db')
const xlsx = require('xlsx')

const { GroupService } = require('./service');
const { SmetaService } = require('../../../smeta/smeta/service');


exports.Controller = class {
    static async createGroup(req, res) {
        const { smeta_id } = req.body;

        const smeta = await SmetaService.getById({ id: smeta_id });
        if (!smeta) {
            return res.error('Smeta not found', 404);
        }

        const result = await GroupService.create({ ...req.body });

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }

    static async getGroup(req, res) {
        const { page, limit, search } = req.query;
        const offset = (page - 1) * limit;
        const { data, total } = await GroupService.get({ offset, limit, search });

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        };

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async getById(req, res) {
        const id = req.params.id;

        const data = await GroupService.getById({ id, isdeleted: true });
        if (!data) {
            return res.error(req.i18n.t('groupNotFound'), 404);
        }

        return res.success(req.i18n.t('getSuccess'), 200, req.query, data);
    }

    static async updateGroup(req, res) {
        const { smeta_id } = req.body;
        const id = req.params.id;

        const group = await GroupService.getById({ id });
        if (!group) {
            return res.error(req.i18n.t('groupNotFound'), 404);
        }

        const smeta = await SmetaService.getById({ id: smeta_id });
        if (!smeta) {
            return res.error(req.i18n.t('smetaNotFound'), 404);
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
        const group = await GroupDB.getById([id]);
        if (!group) {
            return res.error(req.i18n.t('groupNotFound'), 404);
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
                group.group_number ? group.group_number : '',
                group.provodka_kredit ? group.provodka_kredit : '',
                group.provodka_subschet ? String(group.provodka_subschet).replace(/\s+/g, '') : '',
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