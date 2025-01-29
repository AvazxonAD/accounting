const { db } = require('../../db/index');
const { KassaPrixodDB } = require('./db');
const { tashkentTime, HelperFunctions } = require('../../helper/functions');

exports.KassaPrixodService = class {
    static async createPrixod(data) {
        const summa = HelperFunctions.summaDoc(data);
        
        db.transaction(async client => {
            const doc = await KassaPrixodDB.createPrixod([
                data.doc_num,
                data.doc_date,
                data.opisanie,
                summa,
                data.id_podotchet_litso,
                data.main_schet_id,
                data.user_id,
                tashkentTime(),
                tashkentTime(),
                data.main_zarplata_id
            ], client)

            await this.createPrixodChild();

        })
    }

    static async createPrixodChild(data) {
        const create_childs = [];
        for (let child of data.childs) {
            create_childs.push(
                child.spravochnik_operatsii_id,
                child.summa,
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                data.docId,
                data.user_id,
                data.main_schet_id,
                tashkentTime(),
                tashkentTime(),
            )
        }
    }
}