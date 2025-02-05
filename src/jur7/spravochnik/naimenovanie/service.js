const { NaimenovanieDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions')

exports.NaimenovanieService = class {
    static async getById(data) {
        const result = await NaimenovanieDB.getById([data.region_id, data.id]);
        return result;
    }

    static async getNaimenovanie(data) {
        const result = await NaimenovanieDB.getNaimenovanie([data.region_id, data.offset, data.limit]);
        return result;
    }

    static async createNaimenovanie(data) {
        const result = [];
        for (let doc of data.childs) {
            if (doc.iznos) {
                for (let i = 1; i <= doc.kol; i++) {
                    const product = await NaimenovanieDB.createNaimenovanie([
                        data.user_id,
                        data.budjet_id,
                        doc.name,
                        doc.edin,
                        doc.group_jur7_id,
                        doc.inventar_num,
                        doc.serial_num,
                        tashkentTime(),
                        tashkentTime()
                    ])
                    result.push({ ...product, ...doc, kol: 1 });
                }
            } else {
                const product = await NaimenovanieDB.createNaimenovanie([
                    data.user_id,
                    data.budjet_id,
                    doc.name,
                    doc.edin,
                    doc.group_jur7_id,
                    doc.inventar_num,
                    doc.serial_num,
                    tashkentTime(),
                    tashkentTime()
                ])
                result.push({ ...product, ...doc });
            }
        }
        return result;
    }

    static async deleteNaimenovanie(data) {
        for (let child of data.childs) {
            await NaimenovanieDB.deleteNaimenovanie(child.naimenovanie_tovarov_jur7_id);
        }
    }
}