const { db } = require('../../db/index');
const { BankRasxodDB } = require('./db');
const { tashkentTime, HelperFunctions } = require('../../helper/functions');

exports.BankRasxodService = class {
    static async create(data) {
        const summa = HelperFunctions.summaDoc(data.childs);

        const result = await db.transaction(async client => {
            const doc = await bankRasxodDB.createPrixod([
                data.doc_num,
                data.doc_date,
                data.opisanie,
                summa,
                data.id_podotchet_litso,
                data.main_schet_id,
                data.user_id,
                tashkentTime(),
                tashkentTime(),
                data.main_zarplata_id
            ], client)

            await this.createChild({ childs: data.childs, client, docId: doc.id, user_id: data.user_id, main_schet_id: data.main_schet_id });

            return doc;
        });

        return result;
    }

    static async createChild(data) {
        const create_childs = [];
        for (let child of data.childs) {
            create_childs.push(
                child.spravochnik_operatsii_id,
                child.summa,
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                data.docId,
                data.user_id,
                data.main_schet_id,
                tashkentTime(),
                tashkentTime(),
            )
        }

        const _values = HelperFunctions.paramsValues({ params: create_childs, column_count: 10 });

        await bankRasxodDB.createPrixodChild(create_childs, _values, data.client);
    }

    static async get(data) {
        const result = await bankRasxodDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit]);

        return { data: result.data || [], summa: result.summa, total_count: result.total_count };
    }

    static async getById(data) {
        const result = await bankRasxodDB.getById([data.region_id, data.main_schet_id, data.id], data.iseleted);

        return result;
    }

    static async update(data) {
        const summa = HelperFunctions.summaDoc(data.childs);

        const result = await db.transaction(async client => {
            const doc = await bankRasxodDB.update([
                data.doc_num,
                data.doc_date,
                data.opisanie,
                summa,
                data.id_podotchet_litso,
                tashkentTime(),
                data.id,
                data.main_zarplata_id
            ], client);

            await bankRasxodDB.deleteChild([doc.id], client);

            await this.createChild({ childs: data.childs, client, docId: doc.id, user_id: data.user_id, main_schet_id: data.main_schet_id });

            return doc;
        });

        return result;
    }

    static async delete(data) {
        const result = await db.transaction(async client => {
            const doc = await bankRasxodDB.delete([data.id], client);
            
            return doc;
        });
        
        return result; 
    }
}