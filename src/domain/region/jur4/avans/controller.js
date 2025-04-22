const { checkSchetsEquality, HelperFunctions } = require("@helper/functions");
const { PodrazdelenieService } = require("@podraz/service");
const { MainSchetService } = require("@main_schet/service");
const { AktService } = require("./service");
const { PodotchetService } = require("@podotchet/service");
const { OperatsiiService } = require("@operatsii/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

exports.Controller = class {
  static async create(req, res) {
    const { spravochnik_podotchet_litso_id, doc_date, childs } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const podotchet = await PodotchetService.getById({
      id: spravochnik_podotchet_litso_id,
      region_id,
    });
    if (!podotchet) {
      return res.error(req.i18n.t("podotchetNotFound"), 404);
    }

    const operatsiis = [];

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        id: child.spravochnik_operatsii_id,
        type: "avans_otchet",
      });
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }
      operatsiis.push(operatsii);

      if (child.id_spravochnik_podrazdelenie) {
        const podraz = await PodrazdelenieService.getById({
          region_id,
          id: child.id_spravochnik_podrazdelenie,
        });
        if (!podraz) {
          return res.error(req.i18n.t("podrazNotFound"), 404);
        }
      }

      if (child.id_spravochnik_sostav) {
        const sostav = await SostavService.getById({
          region_id,
          id: child.id_spravochnik_sostav,
        });
        if (!sostav) {
          return res.error(req.i18n.t("sostavNotFound"), 404);
        }
      }

      if (child.id_spravochnik_type_operatsii) {
        const operatsii = await TypeOperatsiiService.getById({
          id: child.id_spravochnik_type_operatsii,
          region_id,
        });
        if (!operatsii) {
          return res.error(req.i18n.t("typeOperatsiiNotFound"), 404);
        }
      }
    }

    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const result = await AktService.create({
      ...req.body,
      user_id,
      region_id,
      ...req.query,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const {
      page,
      limit,
      from,
      to,
      main_schet_id,
      schet_id,
      search,
      order_by,
      order_type,
    } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const offset = (page - 1) * limit;
    const { summa, total_count, data, page_summa } = await AktService.get({
      ...req.query,
      region_id,
      main_schet_id,
      from,
      to,
      offset,
      limit,
      search,
      order_by,
      order_type,
    });

    const pageCount = Math.ceil(total_count / limit);
    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
      page_summa,
    };
    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const { main_schet_id, schet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await AktService.getById({
      region_id,
      main_schet_id,
      id,
      isdeleted: true,
    });
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }
    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const { spravochnik_podotchet_litso_id, doc_date, childs } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id } = req.query;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const old_data = await AktService.getById({ region_id, main_schet_id, id });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const podotchet = await PodotchetService.getById({
      id: spravochnik_podotchet_litso_id,
      region_id,
    });
    if (!podotchet) {
      return res.error(req.i18n.t("podotchetNotFound"), 404);
    }

    const operatsiis = [];

    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        id: child.spravochnik_operatsii_id,
        type: "avans_otchet",
      });
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }
      operatsiis.push(operatsii);

      if (child.id_spravochnik_podrazdelenie) {
        const podraz = await PodrazdelenieService.getById({
          region_id,
          id: child.id_spravochnik_podrazdelenie,
        });
        if (!podraz) {
          return res.error(req.i18n.t("podrazNotFound"), 404);
        }
      }

      if (child.id_spravochnik_sostav) {
        const sostav = await SostavService.getById({
          region_id,
          id: child.id_spravochnik_sostav,
        });
        if (!sostav) {
          return res.error(req.i18n.t("sostavNotFound"), 404);
        }
      }

      if (child.id_spravochnik_type_operatsii) {
        const operatsii = await TypeOperatsiiService.getById({
          id: child.id_spravochnik_type_operatsii,
          region_id,
        });
        if (!operatsii) {
          return res.error(req.i18n.t("typeOperatsiiNotFound"), 404);
        }
      }
    }

    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const result = await AktService.update({
      ...req.query,
      user_id,
      old_data,
      region_id,
      ...req.body,
      id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const { main_schet_id, schet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await AktService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: doc.doc_date,
    });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const result = await AktService.delete({
      id,
      region_id,
      user_id,
      ...req.query,
      ...doc,
    });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, result);
  }
};
