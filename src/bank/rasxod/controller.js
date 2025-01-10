const { MainSchetService } = require('../../spravochnik/main.schet/services')
const { BankRasxodService } = require('./service')

exports.Controller = class {
    static async paymentBankRasxod(req, res) {
        const region_id = req.user.region_id;
        const id = req.params.id;
        const { main_schet_id } = req.query;
        const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error('Main schet not found', 404);
        }
        const bank_rasxod = await BankRasxodService.getByIdBankRasxod({ id, main_schet_id, region_id });
        if (!bank_rasxod) {
            return res.error('Doc not found', 404);
        }
        await BankRasxodService.paymentBankRasxod({ id, status: req.body.status });
        return res.success('Payment successfully', 200);
    }
}