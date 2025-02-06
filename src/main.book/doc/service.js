const { db } = require('../../db/index')
const { tashkentTime, HelperFunctions } = require('../../helper/functions')
const { DocMainBookDB } = require('./db');

exports.MainBookDocService = class {
    static async auto(data) {
        const dates = HelperFunctions.getMonthStartEnd(data.year, data.month);
        for (let schet of data.schets) {
            schet.summa = await DocMainBookDB.autoSumma([data.region_id, dates[1], schet.schet], data.type_document, data.main_schet_id, data.budjet_id);
        }

        return data.schets;
    }

    static async createDoc(data) {
        const doc = await db.transaction(async client => {
            const result = [];
            for (let item of data.childs) {
                result.push(
                    await DocMainBookDB.createDoc([
                        data.user_id,
                        data.budjet_id,
                        data.main_schet_id,
                        item.spravochnik_main_book_schet_id,
                        data.type_document,
                        data.month,
                        data.year,
                        item.debet_sum,
                        item.kredit_sum,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                )
            }
            if (data.type_document !== 'end') {
                await DocMainBookDB.deleteDoc([
                    data.region_id,
                    data.year,
                    data.month,
                    'end',
                    data.budjet_id
                ], client)
                const end_childs = await DocMainBookDB.getSummaBySchets([
                    data.region_id,
                    data.year,
                    data.month,
                    data.budjet_id
                ], client)
                for (let end_item of end_childs) {
                    const summa = end_item.debet_sum - end_item.kredit_sum;
                    await DocMainBookDB.createDoc([
                        data.user_id,
                        data.budjet_id,
                        data.main_schet_id,
                        end_item.spravochnik_main_book_schet_id,
                        'end',
                        data.month,
                        data.year,
                        summa > 0 ? summa : 0,
                        summa < 0 ? Math.abs(summa) : 0,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                }
            }
            return result;
        })
        return doc;
    }

    static async getDocs(data) {
        const docs = await DocMainBookDB.getDoc([data.region_id, data.budjet_id], data.year, data.month, data.type_document);
        return docs;
    }

    static async getByIdDoc(data) {
        const result = await DocMainBookDB.getByIdDoc([
            data.region_id,
            data.year,
            data.month,
            data.type_document,
            data.budjet_id
        ]);
        if (result) {
            result.debet_sum = 0;
            result.kredit_sum = 0;
            for (let child of result.childs) {
                result.debet_sum += child.debet_sum;
                result.kredit_sum += child.kredit_sum;
            }
        }
        return result;
    }

    static async updateDoc(data) {
        const doc = await db.transaction(async client => {
            await DocMainBookDB.deleteDoc([
                data.region_id,
                data.query.year,
                data.query.month,
                data.query.type_document,
                data.budjet_id
            ], client)
            const result = [];
            for (let item of data.body.childs) {
                result.push(
                    await DocMainBookDB.createDoc([
                        data.user_id,
                        data.budjet_id,
                        data.main_schet_id,
                        item.spravochnik_main_book_schet_id,
                        data.body.type_document,
                        data.body.month,
                        data.body.year,
                        item.debet_sum,
                        item.kredit_sum,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                )
            }
            if (data.body.type_document !== 'end') {
                await DocMainBookDB.deleteDoc([
                    data.region_id,
                    data.body.year,
                    data.body.month,
                    'end',
                    data.budjet_id
                ], client)
                const end_childs = await DocMainBookDB.getSummaBySchets([
                    data.region_id,
                    data.body.year,
                    data.body.month,
                    data.budjet_id
                ], client)
                for (let end_item of end_childs) {
                    const summa = end_item.debet_sum - end_item.kredit_sum;
                    await DocMainBookDB.createDoc([
                        data.user_id,
                        data.budjet_id,
                        data.main_schet_id,
                        end_item.spravochnik_main_book_schet_id,
                        'end',
                        data.body.month,
                        data.body.year,
                        summa > 0 ? summa : 0,
                        summa < 0 ? Math.abs(summa) : 0,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                }
            }
            return result;
        })
        return doc;
    }

    static async deleteDoc(data) {
        await DocMainBookDB.deleteDoc([
            data.region_id,
            data.year,
            data.month,
            data.type_document,
            data.budjet_id
        ])
    }

    static async getBySchetSumma(data) {
        const result = await DocMainBookDB.getBySchetSummaWithType([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id,
            data.schet_id
        ]);
        return result;
    }
}