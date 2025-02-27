const { db } = require('@db/index')
const { RasxodDB } = require('./db');
const { tashkentTime, returnParamsValues } = require('@helper/functions');
const { SaldoDB } = require('@saldo/db');

exports.Jur7RsxodService = class {
    static async delete(data) {
        await db.transaction(async (client) => {
            await RasxodDB.delete([data.id], client)

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
        })
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
                data.main_schet_id,
                tashkentTime(),
                tashkentTime()
            ], client);

            await this.createRasxodChild({ ...data, docId: doc.id, client });

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

            return doc;
        });

        return result;
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

    static async update(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

        const result = await db.transaction(async client => {
            await RasxodDB.update([
                data.doc_num,
                data.doc_date,
                data.j_o_num,
                data.opisanie,
                data.doverennost,
                summa,
                data.kimdan_id,
                data.kimga_id,
                data.kimga_name,
                data.kimdan_name,
                tashkentTime(),
                data.id
            ], client);

            await RasxodDB.deleteRasxodChild([data.id], client)

            await this.createRasxodChild({ ...data, docId: data.id, client })

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

            return { id: data.id };
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