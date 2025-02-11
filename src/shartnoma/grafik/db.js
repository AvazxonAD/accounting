const { db } = require('../../db/index');

exports.GrafikDB = class {
    static async deleteGrafikByContractId(params, client) {
        const _db = client || db;

        const query = `UPDATE shartnoma_grafik SET isdeleted = true WHERE id_shartnomalar_organization = $1 AND isdeleted = false`;

        await _db.query(query, params);
    }
}