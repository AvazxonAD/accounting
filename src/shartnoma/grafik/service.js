const { GrafikDB } = require('./db');

exports.GrafikService = class {
    static async create(data) {
        const result = await GrafikDB.create([
            data.id_shartnomalar_organization,
            data.user_id,
            data.budjet_id,
            data.year,
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
        ]);

        return result;
    }
}