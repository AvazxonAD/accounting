const { db } = require('../../db/index')
const { RasxodDB } = require('./db');
const { tashkentTime, returnParamsValues } = require('../../helper/functions');

exports.Jur7RsxodService = class {
    static async createRasxod(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

        await db.transaction(async client => {
            const doc = await RasxodDB.createRasxod([
                data.user_id,
                data.doc_num,
                data.doc_date,
                data.j_o_num,
                data.opisanie,
                data.doverennost,
                summa,
                data.kimdan_id,
                data.kimdan_name,
                data.kimga_id,
                data.kimga_name,
                data.id_shartnomalar_organization,
                data.main_schet_id,
                tashkentTime(),
                tashkentTime()
            ], client);

            await this.createRasxodChild({ ...data, docId: doc.id, client });
        });
    }

    static async createRasxodChild(data) {
        const create_childs = [];
        for (let child of data.childs) {
            create_childs.push(
                child.naimenovanie_tovarov_jur7_id,
                child.kol,
                child.sena,
                child.summa,
                child.debet_schet,
                child.debet_sub_schet,
                child.kredit_schet,
                child.kredit_sub_schet,
                child.data_pereotsenka,
                data.user_id,
                data.docId,
                data.main_schet_id,
                tashkentTime(),
                tashkentTime()
            );
        }

        const _values = returnParamsValues(create_childs, 14);

        await RasxodDB.createRasxodChild(create_childs, _values, data.client);
    }

    static async updateRasxod(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

        await db.transaction(async client => {
            await RasxodDB.updateRasxod([
                data.doc_num,
                data.doc_date,
                data.j_o_num,
                data.opisanie,
                data.doverennost,
                summa,
                data.kimdan_id,
                data.kimdan_name,
                tashkentTime(),
                data.id
            ], client);

            await RasxodDB.deleteRasxodChild([data.id], client)

            await this.createRasxodChild({ ...data, docId: data.id, client })
        })
    }
}