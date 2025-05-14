const { ConstanstsService } = require("./service");

exports.Controller = class {
  static async getPodpisType(req, res) {
    const result = await ConstanstsService.getPodpisType({});

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
