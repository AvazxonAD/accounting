const { ControlDB } = require('./db')
const { RegionDB } = require('@region/db')

exports.ControlService = class {
    static async getControl(req, res) {
        const { month, year } = req.query;
        const regions = await RegionDB.getRegion([0, 9999])
        for (let region of regions) {
            region.counts = await ControlDB.getTablesCount([Number(year), Number(month), region.id]);
        }
        return res.status(200).json({
            message: "Controls get successfully",
            data: regions
        })
    }
}