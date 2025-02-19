const { db } = require('@db/index');
const { KassaRasxodDB } = require('./db');
const { tashkentTime, HelperFunctions } = require('@helper/functions');

exports.KassaRasxodService = class {
    static async create(data) {
        const summa = HelperFunctions.summaDoc(data.childs);

        const result = await db.transaction(async client => {
            const doc = await KassaRasxodDB.create([
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

        await KassaRasxodDB.createChild(create_childs, _values, data.client);
    }

    static async get(data) {
        const result = await KassaRasxodDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit], data.search);

        let page_summa = 0;
        result.data.forEach(item => {
            page_summa += item.summa;
        });

        return { ...result, page_summa };
    }

    static async getById(data) {
        const result = await KassaRasxodDB.getById([data.region_id, data.main_schet_id, data.id], data.iseleted);

        return result;
    }

    static async update(data) {
        const summa = HelperFunctions.summaDoc(data.childs);

        const result = await db.transaction(async client => {
            const doc = await KassaRasxodDB.update([
                data.doc_num,
                data.doc_date,
                data.opisanie,
                summa,
                data.id_podotchet_litso,
                tashkentTime(),
                data.id,
                data.main_zarplata_id
            ], client);

            await KassaRasxodDB.deleteChild([doc.id], client);

            await this.createChild({ childs: data.childs, client, docId: doc.id, user_id: data.user_id, main_schet_id: data.main_schet_id });

            return doc;
        });

        return result;
    }

    static async delete(data) {
        const result = await db.transaction(async client => {
            const doc = await KassaRasxodDB.delete([data.id], client);
            
            return doc;
        });
        
        return result; 
    }
}