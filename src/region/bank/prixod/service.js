const { db } = require('@db/index');
const { BankPrixodDB } = require('./db');
const { tashkentTime, HelperFunctions } = require('@helper/functions');

exports.BankPrixodService = class {
    static async create(data) {
        const summa = HelperFunctions.summaDoc(data.childs);

        const result = await db.transaction(async client => {
            const doc = await BankPrixodDB.create([
                data.doc_num,
                data.doc_date,
                summa,
                data.provodki_boolean,
                data.opisanie,
                data.id_spravochnik_organization,
                data.id_shartnomalar_organization,
                data.main_schet_id,
                data.user_id,
                data.organization_by_raschet_schet_id,
                data.organization_by_raschet_schet_gazna_id,
                data.shartnoma_grafik_id
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
                child.id_spravochnipodrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                child.id_spravochnik_podotchet_litso,
                data.main_schet_id,
                data.docId,
                data.user_id,
                child.main_zarplata_id
            )
        }

        const _values = HelperFunctions.paramsValues({ params: create_childs, column_count: 10 });

        await BankPrixodDB.createPrixodChild(create_childs, _values, data.client);
    }

    static async get(data) {
        const result = await BankPrixodDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit], data.search);

        let page_summa = 0;
        result.data.forEach(item => {
            page_summa += item.summa;
        });

        return { ...result, page_summa };
    }

    static async getById(data) {
        const result = await BankPrixodDB.getById([data.region_id, data.main_schet_id, data.id], data.isdeleted);

        return result;
    }

    static async update(data) {
        const summa = HelperFunctions.summaDoc(data.childs);

        const result = await db.transaction(async client => {
            const doc = await BankPrixodDB.update([
                data.doc_num,
                data.doc_date,
                summa,
                data.provodki_boolean,
                data.opisanie,
                data.id_spravochnik_organization,
                data.id_shartnomalar_organization,
                data.organization_by_raschet_schet_id,
                data.organization_by_raschet_schet_gazna_id,
                data.shartnoma_grafik_id,
                data.id
            ], client);
            
            await BankPrixodDB.deleteChild([doc.id], client);

            await this.createChild({ childs: data.childs, client, docId: doc.id, user_id: data.user_id, main_schet_id: data.main_schet_id });

            return doc;
        });

        return result;
    }

    static async delete(data) {
        const result = await db.transaction(async client => {
            const doc = await BankPrixodDB.delete([data.id], client);

            return doc;
        });

        return result;
    }
}