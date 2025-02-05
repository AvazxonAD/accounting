const { GroupDB } = require('./db');
const { HelperFunctions } = require('../../../helper/functions');

exports.GroupService = class {
    static async getById(data) {
        const result = await GroupDB.getById([data.id]);
        return result;
    }

    static async getByName(data) {
        const result = await GroupDB.getByName([data.name]);

        return result;
    }

    static async getByNumberName(data) {
        const result = await GroupDB.getByNumberName([data.number, data.name]);

        return result;
    }

    static async get(data) {
        const result = await GroupDB.getGroup([data.offset, data.limit], data.search);

        return { data: result.data || [], total: result.total }
    }

    static async create(data) {
        const result = await GroupDB.createGroup([
            data.smeta_id,
            data.name,
            data.schet,
            data.iznos_foiz,
            data.provodka_debet,
            data.group_number,
            data.provodka_kredit,
            data.provodka_subschet,
            data.roman_numeral,
            data.pod_group,
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime()
        ]);

        return result;
    }

    static async update(data) {
        const result = await GroupDB.updateGroup([
            data.smeta_id,
            data.name,
            data.schet,
            data.iznos_foiz,
            data.provodka_debet,
            data.group_number,
            data.provodka_kredit,
            data.provodka_subschet,
            data.roman_numeral,
            data.pod_group,
            HelperFunctions.tashkentTime(),
            data.id
        ]);

        return result;
    }
}