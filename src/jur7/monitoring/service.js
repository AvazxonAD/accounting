const { Monitoringjur7DB } = require('./db')
const ExcelJS = require('exceljs')

exports.MonitoringService = class {
    static async obrotkaReport(req, res) {
        const { month, year, main_schet_id } = req.query;
        const schets = await Monitoringjur7DB.getSchets([year, month, main_schet_id])
        
    }
}