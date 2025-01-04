const { OxDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');

exports.DocService = class {

    static async getDoc(data, year, month) {
        const result = await OxDB.getDoc([], year, month);
        for (let doc of result) {
            doc.summa = await OxDB.getDocChildsSum([doc.id]);
        }
        return result;
    }

    static async getByIdDoc(id) {
        let doc = await OxDB.getByIdDoc([id]);
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

    static async confirmDoc(data) {
        await OxDB.confirmDoc([data.status, data.user_id, tashkentTime(), data.id]);
    }
}