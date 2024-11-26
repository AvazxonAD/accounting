const { PodotchetDB } = require('../spravochnik/podotchet/db')
const { MainSchetDB } = require('../spravochnik/main.schet/db')
const { BankRasxodDB } = require('../bank/rasxod/db')
const { BankPrixodDB } = require('../bank/prixod/db')
const { KassaPrixodDB } = require('../kassa/prixod/db')
const { KassaRasxodDB } = require('../kassa/rasxod/db')
const { AvansDB } = require('../avans/db')


exports.PodotchetMonitoringService = class {
    
    static async getByIdPodotchetMonitoring(req, res) {
        const podotchet_id = req.params.id
        const { limit, page, main_schet_id, from, to, operatsii } = req.query
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;
        const podotchet = await PodotchetDB.getByIdPodotchet([region_id, podotchet_id])
        
        if (!podotchet) {
            return res.status(404).json({
                message: "podotchet not found"
            })
        }
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }

        const bank_rasxod = await BankRasxodDB.getByPodotchetIdBankRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const bank_prixod = await BankPrixodDB.getByPodotchetIdBankPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const kassa_prixod = await KassaPrixodDB.getByPodotchetIdKassaPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const kassa_rasxod = await KassaRasxodDB.getByPodotchetIdKassaRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const avans = await AvansDB.getByPodotchetIdAvans([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const data = [...bank_prixod, ...bank_rasxod, ...kassa_prixod, ...kassa_rasxod, ...avans]
        
        const bank_rasxod_from_summa = await BankRasxodDB.getByPodotchetIdSummaBankRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const bank_prixod_from_summa = await BankPrixodDB.getByPodotchetIdSummaBankPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_prixod_from_summa = await KassaPrixodDB.getByPodotchetIdSummaKassaPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_rasxod_from_summa = await KassaRasxodDB.getByPodotchetIdSummaKassaRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const avans_from_summa = await AvansDB.getByPodotchetIdSummaAvans([region_id, main_schet_id, from, podotchet_id, operatsii])
        const summa_from = (bank_rasxod_from_summa + kassa_rasxod_from_summa) - (bank_prixod_from_summa + kassa_prixod_from_summa + avans_from_summa)

        const bank_rasxod_to_summa = await BankRasxodDB.getByPodotchetIdSummaBankRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const bank_prixod_to_summa = await BankPrixodDB.getByPodotchetIdSummaBankPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_prixod_to_summa = await KassaPrixodDB.getByPodotchetIdSummaKassaPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_rasxod_to_summa = await KassaRasxodDB.getByPodotchetIdSummaKassaRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const avans_to_summa = await AvansDB.getByPodotchetIdSummaAvans([region_id, main_schet_id, to, podotchet_id, operatsii])
        const summa_to = (bank_rasxod_to_summa + kassa_rasxod_to_summa) - (bank_prixod_to_summa + kassa_prixod_to_summa + avans_to_summa)

        const bank_rasxod_total = await BankRasxodDB.getByPodotchetIdTotalBankRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const bank_prixod_total = await BankPrixodDB.getByPodotchetIdTotalBankPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const kassa_prixod_total = await KassaPrixodDB.getByPodotchetIdTotalKassaPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const kassa_rasxod_total = await KassaRasxodDB.getByPodotchetIdTotalKassaRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const avans_total = await AvansDB.getByPodotchetIdTotalAvans([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const total = bank_prixod_total + bank_rasxod_total + kassa_prixod_total + kassa_rasxod_total + avans_total 

        let summa_rasxod = 0
        let summa_prixod = 0
        data.forEach(item => {
            summa_rasxod += item.rasxod_sum
            summa_prixod += item.prixod_sum
        }) 

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_from,
            summa_to,
            summa_prixod,
            summa_rasxod
        }

        return res.status(200).json({
            message: "podotcbet monitoring successfully get",
            meta,
            data
        })
    }

    static async  getPodotchetMonitroing(req, res) {
        const { limit, page, main_schet_id, from, to, operatsii } = req.query
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;

        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }

        const bank_rasxod = await BankRasxodDB.getBySchetBankRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const bank_prixod = await BankPrixodDB.getBySchetBankPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const kassa_prixod = await KassaPrixodDB.getBySchetKassaPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const kassa_rasxod = await KassaRasxodDB.getBySchetKassaRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii, offset, limit,])
        const data = [...bank_prixod, ...bank_rasxod, ...kassa_prixod, ...kassa_rasxod]
        
        const bank_rasxod_from_summa = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const bank_prixod_from_summa = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_prixod_from_summa = await KassaPrixodDB.getBySchetKassaPrixod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const kassa_rasxod_from_summa = await KassaRasxodDB.getBySchetKassaRasxod([region_id, main_schet_id, from, podotchet_id, operatsii])
        const summa_from = (bank_rasxod_from_summa + kassa_rasxod_from_summa) - (bank_prixod_from_summa + kassa_prixod_from_summa)

        const bank_rasxod_to_summa = await BankRasxodDB.getBySchetSummaBankRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const bank_prixod_to_summa = await BankPrixodDB.getBySchetSummaBankPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_prixod_to_summa = await KassaPrixodDB.getBySchetSummaKassaPrixod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const kassa_rasxod_to_summa = await KassaRasxodDB.getBySchetSummaKassaRasxod([region_id, main_schet_id, to, podotchet_id, operatsii])
        const summa_to = (bank_rasxod_to_summa + kassa_rasxod_to_summa) - (bank_prixod_to_summa + kassa_prixod_to_summa)

        const bank_rasxod_total = await BankRasxodDB.getBySchetTotalBankRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const bank_prixod_total = await BankPrixodDB.getBySchetTotalBankPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const kassa_prixod_total = await KassaPrixodDB.getBySchetTotalKassaPrixod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const kassa_rasxod_total = await KassaRasxodDB.getBySchetTotalKassaRasxod([region_id, main_schet_id, from, to, podotchet_id, operatsii])
        const total = bank_prixod_total + bank_rasxod_total + kassa_prixod_total + kassa_rasxod_total  

        let summa_rasxod = 0
        let summa_prixod = 0
        data.forEach(item => {
            summa_rasxod += item.rasxod_sum
            summa_prixod += item.prixod_sum
        }) 

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_from,
            summa_to,
            summa_prixod,
            summa_rasxod
        }

        return res.status(200).json({
            message: "podotcbet monitoring successfully get",
            meta,
            data
        })
    }
}