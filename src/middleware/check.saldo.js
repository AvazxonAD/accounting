const { MainSchetService } = require(`@main_schet/service`);
exports.checkJur1Saldo = (service) => {
  return async (req, res, next) => {
    try {
      const region_id = req.user.region_id;
      const main_schet_id = req.query.main_schet_id;

      const main_schet = await MainSchetService.getById({
        id: main_schet_id,
        region_id,
      });

      if (!main_schet) {
        return res.error(req.i18n.t("mainSchetNotFound"), 404);
      }

      const check = await service({ main_schet_id, region_id });

      if (Array.isArray(check) && check.length > 0) {
        return res.error(req.i18n.t("saldoError"), 400, { dates: check });
      }

      next();
    } catch (error) {
      return res.error(error.message, 500);
    }
  };
};
