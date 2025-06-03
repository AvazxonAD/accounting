const { Jur7SaldoService } = require("@jur7_saldo/service");
const { ValidatorFunctions } = require(`@helper/database.validator`);
const { MainSchetService } = require("../domain/region/spravochnik/main.schet/service");

exports.Middleware = class {
  static async jur7Block(req, res, next) {
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const block = await Jur7SaldoService.getBlock({ region_id, main_schet_id });

    if (block.length > 0) {
      return res.error(req.i18n.t("jur7Block"), 400, block);
    }

    next();
  }
};
