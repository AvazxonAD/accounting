const { ResponsibleService } = require("@responsible/service");
const { MainSchetService } = require("@main_schet/service");
const { RegionService } = require("@region/service");
const { BudjetService } = require("@budjet/service");
const { Jur7MonitoringService } = require("./service");
const { ProductService } = require("@product/service");

exports.Controller = class {
  static async getSaldo(req, res) {
    const region_id = req.user.region_id;
    const { responsible_id, page, limit, product_id } = req.query;

    const responsible = await ResponsibleService.getById({
      id: responsible_id,
      region_id,
    });
    if (!responsible) {
      return res.error(req.i18n.t("responsibleNotFound"), 404);
    }

    if (product_id) {
      const product = await ProductService.getById({
        region_id,
        id: product_id,
      });
      if (!product) {
        return res.error(req.i18n.t("productNotFound"), 404);
      }
    }

    const offset = (page - 1) * limit;

    const { products, total } = await Jur7MonitoringService.getSaldo({
      ...req.query,
      offset,
      limit,
    });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, products);
  }

  static async obrotkaReport(req, res) {
    const { month, year, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const region = await RegionService.getById({ id: region_id });

    const schets = await Jur7MonitoringService.getSchets({
      year,
      month,
      main_schet_id,
    });

    const { fileName, filePath } = await Jur7MonitoringService.obrotkaExcel({
      schets,
      region,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.sendFile(filePath);
  }

  static async materialReport(req, res) {
    const { month, year, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
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
    const { budjet_id, from, to, excel } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const data = await Jur7MonitoringService.cap({
      region_id,
      budjet_id,
      from,
      to,
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

  static async backCap(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, from, to, excel } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const data = await Jur7MonitoringService.backCap({
      region_id,
      budjet_id,
      from,
      to,
    });

    if (excel === "true") {
      const { fileName, filePath } = await Jur7MonitoringService.backCapExcel({
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
