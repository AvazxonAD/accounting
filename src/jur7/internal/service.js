const { InternalDB } = require('./db');
const { tashkentTime, returnParamsValues } = require('../../helper/functions');
const { db } = require('../../db/index')

exports.Jur7InternalService = class {
    static async createInternal(data) {
        await db.transaction(async client => {
            const summa = data.childs.reduce((acc, child) => acc += child.summa, 0);
            const doc = await InternalDB.createInternal([
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
                data.main_schet_id,
                tashkentTime(),
                tashkentTime()
            ], client);

            await this.createInternalChild({ ...data, docId: doc.id, client });
        })
    }

    static async createInternalChild(data) {
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

        await InternalDB.createInternalChild(create_childs, _values, data.client);
    }


    static async updateInternal(data) {
        await db.transaction(async client => {
            const summa = data.childs.reduce((acc, child) => acc += child.summa, 0);
            await InternalDB.updateInternal([
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
                tashkentTime(),
                data.id
            ], client);
            
            await InternalDB.deleteInternalChild([data.id], client)
            
            await this.createInternalChild({ ...data, docId: data.id, client });
        })
    }
}