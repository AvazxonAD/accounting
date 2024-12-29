const { DocMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { db } = require('../../db/index')

exports.DocService = class {
    static async createDoc(data) {
        const result = await db.transaction(async client => {
            const doc = await DocMainBookDB.createDoc([
                data.user_id,
                data.budjet_id,
                data.type_document,
                data.month,
                data.year,
                tashkentTime(),
                tashkentTime()
            ], client);
            const create_childs = []
            data.childs.forEach(item => {
                create_childs.push(
                    item.smeta_grafik_id,
                    doc.id,
                    item.debet_sum,
                    item.kredit_sum,
                    tashkentTime(),
                    tashkentTime()
                );
            });
            doc.childs = await DocMainBookDB.createDocChild(create_childs, client);
            return doc;
        });
        return result;
    }

    static async getDoc(data, year, month, type) {
        const result = await DocMainBookDB.getDoc([data.region_id, data.budjet_id], year, month, type);
        for (let doc of result) {
            doc.summa = await DocMainBookDB.getDocChildsSum([doc.id]);
        }
        return result;
    }

    static async getByIdDoc(region_id, budjet_id, id, isdeleted) {
        let doc = await DocMainBookDB.getByIdDoc([region_id, budjet_id, id], isdeleted);
        doc ? doc.childs = await DocMainBookDB.getDocChilds([doc.id]) : doc = null;
        return doc;
    }

    static async updateDoc(data) {
        const result = await db.transaction(async client => {
            const doc = await DocMainBookDB.updateDoc([data.type_document, data.month, data.year, tashkentTime(), data.id], client)
            await DocMainBookDB.deleteDocChilds([doc.id], client)
            const create_childs = []
            data.childs.forEach(item => {
                create_childs.push(
                    item.smeta_grafik_id,
                    doc.id,
                    item.debet_sum,
                    item.kredit_sum,
                    tashkentTime(),
                    tashkentTime()
                );
            });
            doc.childs = await DocMainBookDB.createDocChild(create_childs, client);
            return doc;
        })
        return result;
    }

    static async deleteDoc(id) {
        await db.transaction(async client => {
            await DocMainBookDB.deleteDoc([id], client)
        })
    }
}