const { BudjetService } = require("@budjet/service");
const { OdinoxService } = require("./service");
const { HelperFunctions } = require(`@helper/functions`);
const { ReportTitleService } = require(`@report_title/service`);
const { SALDO_PASSWORD } = require(`@helper/constants`);
const { ValidatorFunctions } = require(`@helper/database.validator`);

exports.Controller = class {
  static async getSmeta(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await OdinoxService.getSmeta({
      ...req.query,
      region_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getOdinoxType(req, res) {
    const result = await OdinoxService.getOdinoxType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getData(req, res) {
    const { year, month, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const types = await OdinoxService.getOdinoxType({});

    const date = HelperFunctions.getMonthStartEnd({ year, month });

    const smetas = await OdinoxService.getSmeta({ ...req.query, region_id });

    for (let type of types) {
      if (type.sort_order === 0) {
        type.sub_childs = OdinoxService.getJur0Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
        });
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, types);
  }
};
