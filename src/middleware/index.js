const { SaldoService } = require("@jur7_saldo/service");
const { ValidatorFunctions } = require(`@helper/database.validator`);

exports.Middleware = class {
  static async jur7Block(req, res, next) {
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const block = await SaldoService.getBlock({ region_id, main_schet_id });

    if (block.length > 0) {
      return res.error(req.i18n.t("jur7Block"), 400, block);
    }

    next();
  }
};
