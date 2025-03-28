const { ResponsibleService } = require("@responsible/service");
const { MainSchetService } = require("@main_schet/service");
const { RegionService } = require("@region/service");
const { BudjetService } = require("@budjet/service");
const { Jur7MonitoringService } = require("./service");
const { ProductService } = require("@product/service");

exports.Controller = class {
  static async materialReport(req, res) {
    const { month, year, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const region = await RegionService.getById({ id: region_id });

    const schets = await Jur7MonitoringService.getSchets({
      year,
      month,
      main_schet_id,
    });

    const responsibles = await ResponsibleService.get({
      region_id,
      offset: 0,
      limit: 99999,
    });

    const result = await Jur7MonitoringService.materialReport({
      responsibles: responsibles.data,
      region,
      main_schet_id,
      year,
      month,
      schets,
    });

    const { fileName, filePath } = await Jur7MonitoringService.materialExcel({
      responsibles: result,
      month,
      year,
      region,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.sendFile(filePath);
  }

  static async cap(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, year, month, excel } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const data = await Jur7MonitoringService.cap({
      region_id,
      year,
      month,
    });

    if (excel === "true") {
      const { fileName, filePath } = await Jur7MonitoringService.capExcel({
        ...data,
        from,
        to,
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      return res.download(filePath);
    }
    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }
};
