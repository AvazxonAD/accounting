const { PrixodDB } = require('./db');
const { db } = require('../../db/index');
const { IznosDB } = require('../iznos/db')
const { tashkentTime } = require('../../helper/functions');
const { SaldoDB } = require('../saldo/db');
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db');
const { GroupDB } = require('../spravochnik/group/db');



exports.PrixodJur7Service = class {

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
                    ], data.client)

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
                ], data.client)

                result.push({ ...product, ...doc });
            }
        }
        return result;
    }


    static async createPrixod(data) {
        await db.transaction(async (client) => {
            const childs = await this.createNaimenovanie({ childs: data.childs, user_id: data.user_id, budjet_id: data.budjet_id, client });

            const summa = childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

            const doc = await PrixodDB.createPrixod(
                [
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

            await this.createPrixodChild({ ...data, docId: doc.id, client, childs });
        });
    }

    static async createPrixodChild(data) {
        for (const child of data.childs) {
            const summa = child.kol * child.sena;
            const nds_summa = child.nds_foiz / 100 * summa;
            const summa_s_nds = summa + nds_summa;
            await PrixodDB.createPrixodChild([
                child.id,
                child.kol,
                child.sena,
                summa,
                child.nds_foiz,
                nds_summa,
                summa_s_nds,
                child.debet_schet,
                child.debet_sub_schet,
                child.kredit_schet,
                child.kredit_sub_schet,
                child.data_pereotsenka,
                data.user_id,
                data.docId,
                data.main_schet_id,
                child.iznos,
                child.eski_iznos_summa,
                tashkentTime(),
                tashkentTime()
            ], data.client);

            const product_sena = await SaldoDB.getSena([child.id], data.client);
            const iznos_summa = (product_sena * (child.iznos_foiz / 100) / 12) + child.eski_iznos_summa;
            const month = new Date(data.doc_date).getMonth() + 1;
            const year = new Date(data.doc_date).getFullYear();

            if (child.iznos) {
                await IznosDB.createIznos([
                    data.user_id,
                    child.inventar_num,
                    child.serial_num,
                    child.id,
                    child.kol,
                    product_sena,
                    data.doc_date,
                    data.kimga_id,
                    iznos_summa,
                    year,
                    month,
                    `${year}-${month}-01`,
                    data.budjet_id,
                    child.eski_iznos_summa,
                    tashkentTime(),
                    tashkentTime()
                ], data.client)
            }

            await SaldoDB.createSaldo([
                data.user_id,
                child.id,
                child.kol,
                product_sena,
                product_sena * child.kol,
                month,
                year,
                `${year}-${month}-01`,
                data.kimga_id,
                iznos_summa,
                tashkentTime(),
                tashkentTime()
            ], data.client)
        }
    }

    static async updatePrixod(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

        await db.transaction(async (client) => {
            await PrixodDB.updatePrixod([
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
                tashkentTime(),
                data.id
            ], client);

            await PrixodDB.deletePrixodChild([data.id], client);

            const childs = await this.createNaimenovanie({ childs: data.childs, user_id: data.user_id, budjet_id: data.budjet_id, client });

            await this.createPrixodChild({ ...data, docId: data.id, childs, client });
        });
    }
}