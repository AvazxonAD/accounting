const { MainSchetService } = require("@main_schet/service");
const { Saldo159Service } = require("./service");
const { BudjetService } = require(`@budjet/service`);
const { HelperFunctions } = require(`@helper/functions`);
const { SALDO_PASSWORD } = require(`@helper/constants`);
const { Monitoring159Service } = require(`@monitoring_159/services`);
const { OrganizationService } = require("@organization/service");

exports.Controller = class {
  static async getFirstSaldo(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await Saldo159Service.getFirstSaldo({
      ...req.query,
      region_id,
    });

    if (!result) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { budjet_id, main_schet_id, schet_id } = req.query;

    const { organizations } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const check = await Saldo159Service.getByMonth({
      ...req.query,
      ...req.body,
      region_id,
    });
    if (check) {
      return res.error(req.i18n.t(`docExists`), 400);
    }

    for (let organization of organizations) {
      const check = await OrganizationService.getById({
        region_id,
        id: organization.organization_id,
      });
      if (!check) {
        return res.error(req.i18n.t("organizationNotFound"), 404);
      }
    }

    const result = await Saldo159Service.create({
      ...req.body,
      ...req.query,
      user_id,
    });

    return res.success(
      req.i18n.t("createSuccess"),
      201,
      { dates: result.dates },
      result.doc
    );
  }

  static async getData(req, res) {
    const region_id = req.user.region_id;
    const { first, year, month, main_schet_id, schet_id, budjet_id } =
      req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    if (first === "true") {
      const organizations = await OrganizationService.get({
        region_id,
        offset: 0,
        limit: 99999999,
      });

      for (let organ of organizations.data) {
        organ.prixod = 0;
        organ.rasxod = 0;
        organ.organization_id = organ.id;
      }

      return res.success(
        req.i18n.t("getSuccess"),
        200,
        null,
        organizations.data
      );
    }

    const last_date = HelperFunctions.lastDate({ ...req.query });

    const last_saldo = await Saldo159Service.getByMonth({
      ...req.query,
      year: last_date.year,
      region_id,
      month: last_date.month,
    });

    if (!last_saldo) {
      return res.error(req.i18n.t("lastSaldoNotFound"), 400);
    }

    const date = HelperFunctions.getDate({ year, month });

    const docs = await Monitoring159Service.monitoring({
      region_id,
      main_schet_id,
      schet: schet.schet,
      from: date[0],
      to: date[1],
      offset: 0,
      limit: 99999999,
    });

    for (let organ of last_saldo.childs) {
      for (let doc of docs.data) {
        if (organ.organization_id === doc.organ_id) {
          organ.prixod += doc.summa_prixod;
          organ.rasxod += doc.summa_rasxod;
        }
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, last_saldo.childs);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, schet_id, main_schet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    let check = true;

    if (!main_schet_id && schet_id) {
      check = false;
    }

    if (main_schet_id && check) {
      const main_schet = await MainSchetService.getById({
        region_id,
        id: main_schet_id,
      });

      if (!main_schet) {
        check = false;
      }

      if (schet_id) {
        const schet = main_schet?.jur3_schets_159.find(
          (item) => item.id === Number(schet_id)
        );
        if (!schet) {
          check = false;
        }
      }
    }

    if (!check) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const { docs, meta } = await Saldo159Service.get({
      region_id,
      ...req.query,
    });

    if (docs[0]) {
      docs[0].isdeleted = true;
    }

    return res.success(req.i18n.t("getSuccess"), 200, meta, docs);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const result = await Saldo159Service.getById({
      region_id,
      id,
      budjet_id,
      isdeleted: true,
    });
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async cleanData(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, password, schet_id } = req.query;

    if (password !== SALDO_PASSWORD) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    await Saldo159Service.cleanData({ ...req.query });

    return res.success(req.i18n.t(`cleanSuccess`), 200);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id, main_schet_id, schet_id } = req.query;
    const user_id = req.user.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const old_data = await Saldo159Service.getById({
      region_id,
      budjet_id,
      id,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await Saldo159Service.update({
      ...req.body,
      ...old_data,
      ...req.query,
      region_id,
      user_id,
      id,
    });

    return res.success(
      req.i18n.t("updateSuccess"),
      200,
      { dates: result.dates },
      result.doc
    );
  }

  static async delete(req, res) {
    const { budjet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { main_schet_id, schet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const end = await Saldo159Service.getEndSaldo({
      region_id,
      main_schet_id,
      schet_id,
    });
    if (!end) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }
    if (end.id !== id) {
      return res.error(req.i18n.t("deleteSaldoError"), 400);
    }

    const doc = await Saldo159Service.getById({
      region_id,
      budjet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await Saldo159Service.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, result);
  }
};
