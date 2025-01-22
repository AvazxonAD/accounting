const { FeaturesService } = require('./service');

exports.Controller = class {
    static async getDocNum(req, res) {
        const { page } = req.params;
        const region_id = req.user.region_id;
        const main_schet_id = req.query.main_schet_id;
        
        const tableName = FeaturesService.getTableName({ page });

        const doc_num = await FeaturesService.getDocNum({tableName, region_id, main_schet_id});

        return res.success('Get successfully', 200, null, doc_num);
    }
}