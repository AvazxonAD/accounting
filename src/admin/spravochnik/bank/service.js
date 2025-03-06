const { BankMfoDB } = require('./db');
const { HelperFunctions } = require('@helper/functions');

exports.BankService = class {
    static async getByMfoName(data) {
        const result = await BankMfoDB.getByMfoName([data.mfo, data.bank_name]);

        return result;
    }

    static async create(data) {
        const result = await BankMfoDB.create([
            data.mfo,
            data.bank_name,
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime()
        ]);

        return result;
    }
}