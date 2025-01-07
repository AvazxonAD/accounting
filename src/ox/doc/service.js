const { db } = require('../../db/index')
const { tashkentTime } = require('../../helper/functions')
const { DocOx } = require('./db')

exports.OxDocService = class {
    static async createDoc(data) {
        const doc = await db.transaction(async client => {
            const result = [];
            for (let item of data.childs) {
                result.push(
                    await DocOx.createDoc([
                        data.user_id,
                        data.main_schet_id,
                        data.budjet_id,
                        item.smeta_grafik_id,
                        data.month,
                        data.year,
                        item.ajratilgan_mablag,
                        item.tulangan_mablag_smeta_buyicha,
                        item.kassa_rasxod,
                        item.haqiqatda_harajatlar,
                        item.ajratilgan_mablag - item.kassa_rasxod,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                );
            }
            return result;
        })
        return doc;
    }

    static async getDocs(data) {
        const docs = await DocOx.getDoc([data.region_id, data.budjet_id], data.year, data.month, data.type_document);
        return docs;
    }

    static async getByIdDoc(data) {
        const result = await DocOx.getByIdDoc([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id
        ]);
        return result;
    }

    static async updateDoc(data) {
        const doc = await db.transaction(async client => {
            await DocOx.deleteDoc([
                data.region_id,
                data.query.year,
                data.query.month,
                data.budjet_id
            ], client)
            const result = [];
            for (let child of data.body.childs) {
                result.push(
                    await DocOx.createDoc([
                        data.user_id,
                        data.main_schet_id,
                        data.budjet_id,
                        child.smeta_grafik_id,
                        data.body.month,
                        data.body.year,
                        child.ajratilgan_mablag,
                        child.tulangan_mablag_smeta_buyicha,
                        child.kassa_rasxod,
                        child.haqiqatda_harajatlar,
                        child.ajratilgan_mablag - child.kassa_rasxod,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                );
            }
            return result;
        })
        return doc;
    }

    static async deleteDoc(data) {
        await DocOx.deleteDoc([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id
        ])
    }

    static async getByGrafikSumma(data) {
        const result = await DocOx.getByGrafikSummaWithType([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id,
            data.schet_id
        ]);
        return result;
    }
}