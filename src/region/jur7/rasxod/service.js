const { db } = require('@db/index')
const { RasxodDB } = require('./db');
const { tashkentTime, returnParamsValues } = require('@helper/functions');
const { SaldoDB } = require('@saldo/db');

exports.Jur7RsxodService = class {
    static async delete(data) {
        const result = await db.transaction(async (client) => {
            const doc = await RasxodDB.delete([data.id], client)

            const year = new Date(data.oldData.doc_date).getFullYear();
            const month = new Date(data.oldData.doc_date).getMonth() + 1;

            const check = await SaldoDB.getSaldoDate([data.region_id, `${year}-${month}-01`]);
            let dates = [];
            for (let date of check) {
                dates.push(await SaldoDB.createSaldoDate([
                    data.region_id,
                    date.year,
                    date.month,
                    tashkentTime(),
                    tashkentTime()
                ], client));
            }

            return { doc, dates };
        })

        return result;
    }

    static async create(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);
        const result = await db.transaction(async client => {
            const doc = await RasxodDB.create([
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

            await this.createChild({ ...data, docId: doc.id, client });

            const year = new Date(data.doc_date).getFullYear();
            const month = new Date(data.doc_date).getMonth() + 1;

            const check = await SaldoDB.getSaldoDate([data.region_id, `${year}-${month}-01`]);
            let dates = [];
            for (let date of check) {
                dates.push(await SaldoDB.createSaldoDate([
                    data.region_id,
                    date.year,
                    date.month,
                    tashkentTime(),
                    tashkentTime()
                ], client));
            }

            return { doc, dates };
        });

        return result;
    }

    static async createChild(data) {
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
                child.iznos,
                child.iznos_summa,
                child.iznos_schet,
                child.iznos_sub_schet,
                tashkentTime(),
                tashkentTime()
            );
        }

        const _values = returnParamsValues(create_childs, 18);

        await RasxodDB.createChild(create_childs, _values, data.client);
    }

    static async update(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

        const result = await db.transaction(async client => {
            const doc = await RasxodDB.update([
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

            await this.createChild({ ...data, docId: data.id, doc, client })

            let year, month;

            if (new Date(data.oldData.doc_date) > new Date(data.doc_date)) {
                year = new Date(data.doc_date).getFullYear();
                month = new Date(data.doc_date).getMonth() + 1;
            } else if (new Date(data.doc_date) > new Date(data.oldData.doc_date)) {
                year = new Date(data.oldData.doc_date).getFullYear();
                month = new Date(data.oldData.doc_date).getMonth() + 1;
            } else {
                year = new Date(data.doc_date).getFullYear();
                month = new Date(data.doc_date).getMonth() + 1;
            }

            const check = await SaldoDB.getSaldoDate([data.region_id, `${year}-${month}-01`]);

            let dates = [];

            for (let date of check) {
                dates.push(await SaldoDB.createSaldoDate([
                    data.region_id,
                    date.year,
                    date.month,
                    tashkentTime(),
                    tashkentTime()
                ], client));
            }

            return { doc, dates };
        });

        return result;
    }

    static async getById(data) {
        const result = await RasxodDB.getById([data.region_id, data.id, data.main_schet_id], data.isdeleted)
        return result;
    }

    static async get(data) {
        const result = await RasxodDB.get([data.region_id, data.from, data.to, data.main_schet_id, data.offset, data.limit], data.search);
        return result;
    }
}