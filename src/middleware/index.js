const { SaldoService } = require("@jur7_saldo/service");

exports.Middleware = class {
  static async jur7Block(req, res, next) {
    const region_id = req.user.region_id;

    const block = await SaldoService.getBlock({ region_id });

    if (block.length > 0) {
      return res.error(req.i18n.t("jur7Block"), 400, block);
    }

    next();
  }
};
