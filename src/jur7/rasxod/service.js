const { db } = require('../../db/index')
const { RasxodDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');

exports.Jur7RsxodService = class {
    static async createRasxod(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

        let doc;
        await db.transaction(async client => {
            doc = await RasxodDB.createRasxod([
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


        });
    }

    static async createRasxodChild(data) {
        
    }
}