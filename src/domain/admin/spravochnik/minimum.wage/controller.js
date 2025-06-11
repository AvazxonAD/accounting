const { MinimumWageService } = require("./service");

exports.Controller = class {
  static async get(req, res) {
    const data = await MinimumWageService.get({});

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async update(req, res) {
    const { summa } = req.body;

    await MinimumWageService.update({ summa });

    return res.success(req.i18n.t("updateSuccess"), 200);
  }
};
