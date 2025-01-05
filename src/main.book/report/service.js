const { ReportMainBookDB } = require('./db')
const { DocMainBookDB } = require('../doc/db')

const ReportService = class {
    static async getInfo(data) {
        const docs = await ReportMainBookDB.getDocs([data.region_id, data.year, data.month])
        for (let doc of docs) {
            doc = await DocMainBookDB.getByIdDoc([data.region_id, data.budjet_id, doc.id]);

        }
    }
}