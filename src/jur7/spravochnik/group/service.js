const { GroupDB } = require('./db');
const { HelperFunctions } = require('../../../helper/functions');
const { PereotsenkaDB } = require('../pereotsenka/db');


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
        const result = await GroupDB.get([data.offset, data.limit], data.search);

        return { data: result.data || [], total: result.total }
    }

    static async create(data) {
        const result = await GroupDB.create([
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
        const result = await GroupDB.update([
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

    static async delete(data) {
        const result = await GroupDB.delete([data.id]);

        return result;
    }

    static async getWithPercent() {
        const result = await GroupDB.getWithPercent();

        return result;
    }
}