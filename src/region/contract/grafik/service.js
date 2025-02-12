const { GrafikDB } = require('./db');
const { db } = require('@db/index');
const { ContractDB } = require('../contract/db');

exports.GrafikService = class {
    static async create(data) {
        const result = await db.transaction(async client => {
            const grafik = await GrafikDB.create([
                data.id_shartnomalar_organization,
                data.user_id,
                data.budjet_id,
                new Date(data.contract.doc_date).getFullYear(),
                data.oy_1,
                data.oy_2,
                data.oy_3,
                data.oy_4,
                data.oy_5,
                data.oy_6,
                data.oy_7,
                data.oy_8,
                data.oy_9,
                data.oy_10,
                data.oy_11,
                data.oy_12,
                data.yillik_oylik,
                data.smeta_id
            ], client);

            let contract = {};

            const summa = data.summa + data.grafik_summa.summa;
 
            if (summa > data.contract.summa) {
                contract = await ContractDB.updateSumma([summa, data.contract.id], client);
            }

            return { grafik, contract };
        })

        return result;
    }

    static async getSummaByContractId(data) {
        const grafik_summa = await GrafikDB.getSummaByContractId([data.contract_id]);
        
        return grafik_summa;
    }

    static async update(data) {
        const result = await db.transaction(async client => {

            const grafik = await GrafikDB.update([
                data.oy_1,
                data.oy_2,
                data.oy_3,
                data.oy_4,
                data.oy_5,
                data.oy_6,
                data.oy_7,
                data.oy_8,
                data.oy_9,
                data.oy_10,
                data.oy_11,
                data.oy_12,
                data.smeta_id,
                data.id_shartnomalar_organization,
                new Date(data.contract.doc_date).getFullYear(),
                data.id
            ], client);

            let contract = {};

            const summa = (data.summa - data.oldData.summa) + data.grafik_summa.summa;

            if (summa > data.contract.summa) {
                contract = await ContractDB.updateSumma([summa, data.contract.id], client);
            }

            return { grafik, contract };
        })

        return result;
    }

    static async getById(data) {
        const result = await GrafikDB.getById([data.region_id, data.budjet_id, data.id]);

        return result;
    }
}