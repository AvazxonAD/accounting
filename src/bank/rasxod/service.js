const { BankRasxodDB } = require('./db')
const { db } = require('../../db/index')

exports.BankRasxodService = class {
    static async getByIdBankRasxod(data) {
        const result = await BankRasxodDB.getByIdBankRaasxod([data.main_schet_id, data.region_id, data.id], data.isdeleted);
        return result;
    }

    static async paymentBankRasxod(data) {
        await db.transaction(async client => {
            await BankRasxodDB.paymentBankRasxod([data.status, data.id], client);
        })
    }
}