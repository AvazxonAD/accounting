const { RealCostDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { db } = require('../../db/index')

exports.DocService = class {
    static async createDoc(data) {
        const result = await db.transaction(async client => {
            const doc = await RealCostDB.createDoc([
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
            doc.childs = await RealCostDB.createDocChild(create_childs, client);
            const endDoc = await RealCostDB.getDoc([data.region_id, data.budjet_id], data.year, data.month, 'end');
            if (!endDoc.length) {
                const end_doc = await RealCostDB.createDoc([
                    data.user_id,
                    data.budjet_id,
                    'end',
                    data.month,
                    data.year,
                    tashkentTime(),
                    tashkentTime()
                ], client)
                const create_childs = []
                data.childs.forEach(item => {
                    create_childs.push(
                        item.smeta_grafik_id,
                        end_doc.id,
                        item.debet_sum,
                        item.kredit_sum,
                        tashkentTime(),
                        tashkentTime()
                    );
                });
                end_doc.childs = await RealCostDB.createDocChild(create_childs, client);
            } else {
                await RealCostDB.deleteDocChilds([endDoc[0].id], client);
                const create_childs = []
                const end_childs = await RealCostDB.getOperatsiiSum([data.region_id, data.year, data.month, data.budjet_id], client);
                for (let child of end_childs) {
                    create_childs.push(
                        child.smeta_grafik_id,
                        endDoc[0].id,
                        child.debet_sum,
                        child.kredit_sum,
                        tashkentTime(),
                        tashkentTime()
                    );
                }
                endDoc[0].childs = await RealCostDB.createDocChild(create_childs, client);
            }
            return doc;
        });
        return result;
    }

    static async getDoc(data, year, month, type) {
        const result = await RealCostDB.getDoc([data.region_id, data.budjet_id], year, month, type);
        for (let doc of result) {
            doc.summa = await RealCostDB.getDocChildsSum([doc.id]);
        }
        return result;
    }

    static async getByIdDoc(region_id, budjet_id, id, isdeleted) {
        let doc = await RealCostDB.getByIdDoc([region_id, budjet_id, id], isdeleted);
        doc ? doc.childs = await RealCostDB.getDocChilds([doc.id]) : doc = null;
        return doc;
    }

    static async updateDoc(data) {
        const result = await db.transaction(async client => {
            const doc = await RealCostDB.updateDoc([data.type_document, data.month, data.year, tashkentTime(), data.id], client)
            await RealCostDB.deleteDocChilds([doc.id], client)
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
            doc.childs = await RealCostDB.createDocChild(create_childs, client);
            const endDoc = await RealCostDB.getDoc([data.region_id, data.budjet_id], data.year, data.month, 'end');
            if (!endDoc.length) {
                const end_doc = await RealCostDB.createDoc([
                    data.user_id,
                    data.budjet_id,
                    'end',
                    data.month,
                    data.year,
                    tashkentTime(),
                    tashkentTime()
                ], client)
                const create_childs = []
                data.childs.forEach(item => {
                    create_childs.push(
                        item.smeta_grafik_id,
                        end_doc.id,
                        item.debet_sum,
                        item.kredit_sum,
                        tashkentTime(),
                        tashkentTime()
                    );
                });
                end_doc.childs = await RealCostDB.createDocChild(create_childs, client);
            } else {
                await RealCostDB.deleteDocChilds([endDoc[0].id], client);
                const create_childs = []
                const end_childs = await RealCostDB.getOperatsiiSum([data.region_id, data.year, data.month, data.budjet_id], client);
                for (let child of end_childs) {
                    create_childs.push(
                        child.smeta_grafik_id,
                        endDoc[0].id,
                        child.debet_sum,
                        child.kredit_sum,
                        tashkentTime(),
                        tashkentTime()
                    );
                }
                endDoc[0].childs = await RealCostDB.createDocChild(create_childs, client);
            }
            return doc;
        })
        return result;
    }

    static async deleteDoc(id) {
        await db.transaction(async client => {
            await RealCostDB.deleteDoc([id], client)
        })
    }
}