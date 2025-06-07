const { FeaturesService } = require("./service");
const { BudjetService } = require(`@budjet/service`);

exports.Controller = class {
  static async getDocNum(req, res) {
    const { page } = req.params;
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;

    const tableName = FeaturesService.getTableName({ page });

    if (!tableName) {
      return res.error("Page not found", 400);
    }

    const doc_num = await FeaturesService.getDocNum({
      tableName,
      region_id,
      main_schet_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, doc_num);
  }

  static async checkSchets(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const result = await FeaturesService.checkSchets({ region_id, budjet_id });

    return res.success(req.i18n.t("getSuccess"), 200, null, []);
  }
};
