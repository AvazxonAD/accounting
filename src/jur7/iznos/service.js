const { IznosDB } = require('./db');
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db')

exports.IznosService = class {
    static async getByTovarIdIznos(req, res) {
        const region_id = req.user.region_id;
        const tovar_id = req.query.tovar_id;
        const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, tovar_id]);
        if(!product){
            return res.error('Product not found', 404);
        }
        const result = await IznosDB.getByTovarIdIznos([region_id, tovar_id]);
        return res.status(200).json({
            message: "iznos get successfully",
            data: result
        })
    }
}