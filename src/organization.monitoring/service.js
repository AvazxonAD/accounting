const { MainSchetDB } = require('../spravochnik/main.schet/db')
const { BankPrixodDB } = require('../bank/prixod/db')
const { BankRasxodDB } = require('../bank/rasxod/db')


exports.OrganizationMonitoringService = class {
    static async getMonitoring(req, res) {
        const region_id = req.user.region_id
        const { page, limit, main_schet_id, operatsii, from, to } = req.query;
        const offset = (page - 1) * limit;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const bank_prixod = await BankPrixodDB.getBySchetBankPrixod([region_id, main_schet_id, from, to, operatsii, offset, limit])
        const bank_rasxod = await BankRasxodDB.getBySchetBankRasxod([region_id, main_schet_id, from, to, operatsii, offset, limit])
        const data =  [...bank_prixod, ...bank_rasxod]
        const bank_prixod_total = await BankPrixodDB.getBySchetTotalBankPrixod([region_id, main_schet_id, from, to, operatsii])
        const bank_rasod_total = await BankRasxodDB.getBySchetTotalBankRasxod([region_id, main_schet_id, from, to, operatsii])
        const total = bank_prixod_total + bank_rasod_total
    
        const bank_prixod_summa_from = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, from, operatsii])
        const bank_rasxod_summa_from = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, from, operatsii])
        const summa_from = bank_prixod_summa_from + bank_rasxod_summa_from
        
        const bank_prixod_summa_to = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, to, operatsii])
        const bank_rasxod_summa_to = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, to, operatsii])
        const summa_to = bank_prixod_summa_to + bank_rasxod_summa_to
         
        let summa_prixod;
        let summa_rasxod;
        for(let item of data){
            summa_prixod += item.summa_prixod
            summa_rasxod += item.summa_rasxod
        }
        
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_prixod,
            summa_rasxod,
            summa_from,
            summa_to
        }
        return res.status(200).json({
            message: "organization monitoring get successfully!",
            meta, 
            data
        })
    }

    static async getByOrganizationIdMonitoring(req, res) {
        const region_id = req.user.region_id
        const { page, limit, main_schet_id, operatsii, from, to } = req.query;
        const offset = (page - 1) * limit;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const bank_prixod = await BankPrixodDB.getBySchetBankPrixod([region_id, main_schet_id, from, to, operatsii, offset, limit])
        const bank_rasxod = await BankRasxodDB.getBySchetBankRasxod([region_id, main_schet_id, from, to, operatsii, offset, limit])
        const data =  [...bank_prixod, ...bank_rasxod]
        const bank_prixod_total = await BankPrixodDB.getBySchetTotalBankPrixod([region_id, main_schet_id, from, to, operatsii])
        const bank_rasod_total = await BankRasxodDB.getBySchetTotalBankRasxod([region_id, main_schet_id, from, to, operatsii])
        const total = bank_prixod_total + bank_rasod_total
    
        const bank_prixod_summa_from = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, from, operatsii])
        const bank_rasxod_summa_from = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, from, operatsii])
        const summa_from = bank_prixod_summa_from + bank_rasxod_summa_from
        
        const bank_prixod_summa_to = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, to, operatsii])
        const bank_rasxod_summa_to = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, to, operatsii])
        const summa_to = bank_prixod_summa_to + bank_rasxod_summa_to
         
        let summa_prixod;
        let summa_rasxod;
        for(let item of data){
            summa_prixod += item.summa_prixod
            summa_rasxod += item.summa_rasxod
        }
        
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_prixod,
            summa_rasxod,
            summa_from,
            summa_to
        }
        return res.status(200).json({
            message: "organization monitoring get successfully!",
            meta, 
            data
        })
    }
}