const { ConstanstsService } = require("./service");

exports.Controller = class {
  static async getPodpisType(req, res) {
    const result = await ConstanstsService.getPodpisType({});

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getRegions(req, res) {
    const result = await ConstanstsService.getRegions({});

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getDistricts(req, res) {
    const { region_id } = req.query;

    if (region_id) {
      const regions = await ConstanstsService.getRegions({});

      const region = regions.find((item) => item.id == region_id);
      if (!region) {
        return res.error(req.i18n.t("regionNotFound"), 404);
      }
    }

    const result = await ConstanstsService.getDistricts({ region_id });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
