const { MainSchetService } = require("@main_schet/service");
const { Jur3SaldoService } = require("./service");
const { BudjetService } = require(`@budjet/service`);
const { HelperFunctions } = require(`@helper/functions`);
const { SALDO_PASSWORD } = require(`@helper/constants`);
const { OrganizationmonitoringService } = require(`@organ_monitoring/services`);

exports.Controller = class {
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

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    await Jur3SaldoService.cleanData({ ...req.query });

    return res.success(req.i18n.t(`cleanSuccess`), 200);
  }

  static async getDateSaldo(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await Jur3SaldoService.getDateSaldo({
      region_id,
      main_schet_id,
      schet_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async createAuto(req, res) {
    const { region_id, id: user_id } = req.user;
    const { budjet_id } = req.query;
    const { year, month, main_schet_id, schet_id } = req.body;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const last_date = HelperFunctions.lastDate({ year, month });

    const last_saldo = await Jur3SaldoService.getByMonth({
      region_id,
      year: last_date.year,
      month: last_date.month,
      main_schet_id,
      schet_id,
    });
    if (!last_saldo) {
      return res.error(req.i18n.t(`lastSaldoNotFound`), 404);
    }

    const date = HelperFunctions.getDate({
      year: last_date.year,
      month: last_date.month,
    });

    const internal = await OrganizationmonitoringService.getSumma({
      main_schet_id,
      region_id,
      schet: schet.schet,
      from: date[0],
      to: date[1],
    });

    const response = await Jur3SaldoService.createAuto({
      summa: last_saldo.summa + internal.summa,
      main_schet_id,
      year,
      region_id,
      schet_id,
      month,
      user_id,
      budjet_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, response);
  }

  static async getByMonth(req, res) {
    const region_id = req.user.region_id;
    const { year, month, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await Jur3SaldoService.getByMonth({
      region_id,
      year,
      month,
      main_schet_id,
    });

    if (!result) {
      return res.error(req.i18n.t(`saldoNotFound`), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;

    const { year, month, main_schet_id, schet_id } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const check = await Jur3SaldoService.get({
      year,
      main_schet_id,
      schet_id,
      region_id,
      month,
      budjet_id,
    });
    if (check.docs.length) {
      return res.error(req.i18n.t(`docExists`), 409);
    }

    const result = await Jur3SaldoService.create({
      ...req.body,
      main_schet_id,
      budjet_id,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
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
        const schet = main_schet.jur3_schets.find(
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

    const { docs, summa } = await Jur3SaldoService.get({
      region_id,
      ...req.query,
    });

    for (let doc of docs) {
      const first_saldo = await Jur3SaldoService.getFirstSaldo({
        region_id,
        main_schet_id: doc.main_schet_id,
        schet_id: doc.schet_id,
      });

      if (doc.id === first_saldo.id) {
        doc.updated = true;
      } else {
        doc.updated = false;
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, { summa }, docs);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const result = await Jur3SaldoService.getById({
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

  static async update(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id } = req.query;
    const { main_schet_id, schet_id } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const first_saldo = await Jur3SaldoService.getFirstSaldo({
      region_id,
      main_schet_id,
      schet_id,
    });

    if (first_saldo.id !== id) {
      return res.error(req.i18n.t("firstSaldoError"), 400);
    }

    const old_data = await Jur3SaldoService.getById({
      region_id,
      budjet_id,
      id,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await Jur3SaldoService.update({
      ...req.body,
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
    const { main_schet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const first_saldo = await Jur3SaldoService.getFirstSaldo({
      region_id,
      main_schet_id,
    });
    if (first_saldo.id !== id) {
      return res.error(req.i18n.t("firstSaldoError"), 400);
    }

    const doc = await Jur3SaldoService.getById({
      region_id,
      budjet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const date_saldo = HelperFunctions.returnDate({ ...old_data });
    const dates = await Jur3SaldoService.getSaldoDate({
      region_id,
      main_schet_id: old_data.main_schet_id,
      date_saldo,
    });

    if (dates.length) {
      return res.error(req.i18n.t(`firstSaldoError`), 409);
    }

    const result = await Jur3SaldoService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, result);
  }
};
