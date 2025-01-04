const { OxDB } = require('./db');
const { tashkentTime } = require('../helper/functions');
const { db } = require('../db/index')

exports.DocService = class {
    static async createDoc(data) {
        const result = await db.transaction(async client => {
            const doc = await OxDB.createDoc([
                data.user_id,
                data.budjet_id,
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
                    item.allocated_amount,
                    item.by_smeta,
                    item.kassa_rasxod,
                    item.real_rasxod,
                    item.allocated_amount - item.kassa_rasxod,
                    tashkentTime(),
                    tashkentTime()
                );
            });
            doc.childs = await OxDB.createDocChild(create_childs, client);
            return doc;
        });
        return result;
    }

    static async getDoc(data, year, month) {
        const result = await OxDB.getDoc([data.region_id, data.budjet_id], year, month);
        for (let doc of result) {
            doc.summa = await OxDB.getDocChildsSum([doc.id]);
        }
        return result;
    }

    static async getByIdDoc(region_id, budjet_id, id, isdeleted) {
        let doc = await OxDB.getByIdDoc([region_id, budjet_id, id], isdeleted);
        doc ? doc.childs = await OxDB.getDocChilds([doc.id]) : doc = null;
        if (doc) {
            doc.allocated_amount = 0;
            doc.by_smeta = 0;
            doc.kassa_rasxod = 0;
            doc.real_rasxod = 0;
            doc.remaining = 0;
            for (let child of doc.childs) {
                doc.allocated_amount += child.allocated_amount;
                doc.by_smeta += child.by_smeta;
                doc.kassa_rasxod += child.kassa_rasxod;
                doc.real_rasxod += child.real_rasxod;
                doc.remaining += child.remaining;
            }
        }
        return doc;
    }

    static async updateDoc(data) {
        const result = await db.transaction(async client => {
            const doc = await OxDB.updateDoc([data.month, data.year, tashkentTime(), data.id], client)
            await OxDB.deleteDocChilds([doc.id], client)
            const create_childs = []
            data.childs.forEach(item => {
                create_childs.push(
                    item.smeta_grafik_id,
                    doc.id,
                    item.allocated_amount,
                    item.by_smeta,
                    item.kassa_rasxod,
                    item.real_rasxod,
                    item.allocated_amount - item.kassa_rasxod,
                    tashkentTime(),
                    tashkentTime()
                );
            });
            doc.childs = await OxDB.createDocChild(create_childs, client);
            return doc;
        })
        return result;
    }

    static async sendDoc(data) {
        await OxDB.sendDoc([1, tashkentTime(), data.id]);
    }

    static async deleteDoc(id) {
        await db.transaction(async client => {
            await OxDB.deleteDoc([id], client)
        })
    }
}