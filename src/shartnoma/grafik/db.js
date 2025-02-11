const { db } = require('../../db/index');

exports.GrafikDB = class {
    static async deleteGrafikByContractId(params) {
        const query = `
            UPDATE shartnoma_grafik SET ideleted = false WHERE  
        `
    }
}