const { PrixodDB } = require('./db');
const { db } = require('../../db/index');
const { IznosDB } = require('../iznos/db')
const { tashkentTime } = require('../../helper/functions');
const { SaldoDB } = require('../saldo/db');


exports.PrixodJur7Service = class {
    static async createPrixod(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

        await db.transaction(async (client) => {
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
                ],
                client
            );

            await this.createPrixodChild({ ...data, docId: doc.id }, client);
        });
    }

    static async createPrixodChild(data, client) {
        for (const child of data.childs) {
            if (!child.iznos) {
                const summa = child.kol * child.sena;
                const nds_summa = child.nds_foiz / 100 * summa;
                const summa_s_nds = summa + nds_summa;
                await PrixodDB.createPrixodChild([
                    child.naimenovanie_tovarov_jur7_id,
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
                    tashkentTime(),
                    tashkentTime()
                ], client)
            }
            if (child.iznos) {
                const nds_summa = child.nds_foiz / 100 * child.sena;
                const summa_s_nds = child.sena + nds_summa;
                for (let i = 1; i <= child.kol; i++) {
                    await PrixodDB.createPrixodChild([
                        child.naimenovanie_tovarov_jur7_id,
                        1,
                        child.sena,
                        child.sena,
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
                        tashkentTime(),
                        tashkentTime()
                    ], client);

                    const product_sena = await SaldoDB.getSena([child.naimenovanie_tovarov_jur7_id], client);
                    const iznos_summa = product_sena * (child.iznos_foiz / 100) / 12;
                    const month = new Date(data.doc_date).getMonth() + 1;
                    const year = new Date(data.doc_date).getFullYear();
                    await IznosDB.createIznos([
                        data.user_id,
                        child.inventar_num,
                        child.serial_num,
                        child.naimenovanie_tovarov_jur7_id,
                        1,
                        product_sena,
                        data.doc_date,
                        data.kimga_id,
                        iznos_summa,
                        year,
                        month,
                        `${year}-${month}-01`,
                        data.budjet_id,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                }
            }

            const product_sena = await SaldoDB.getSena([child.naimenovanie_tovarov_jur7_id], client);
            const month = new Date(data.doc_date).getMonth() + 2;
            const year = new Date(data.doc_date).getFullYear();
            const iznos_summa = product_sena * (child.iznos_foiz / 100) / 12;
            
            await SaldoDB.createSaldo([
                data.user_id,
                child.naimenovanie_tovarov_jur7_id,
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
            ], client)
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

            await this.createPrixodChild({ ...data, docId: data.id }, client);
        });
    }
}