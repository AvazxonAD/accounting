const { checkSchetsEquality } = require("@helper/functions");
const { MainSchetService } = require("@main_schet/service");
const { PodotchetService } = require("@podotchet/service");
const { OperatsiiService } = require("@operatsii/service");
const { PodrazdelenieService } = require("@podraz/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { KassaRasxodService } = require("./service");
const { KassaSaldoService } = require(`@jur1_saldo/service`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

exports.Controller = class {
  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { id_podotchet_litso, childs, doc_date } = req.body;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    if (id_podotchet_litso) {
      const podotchet = await PodotchetService.getById({
        id: id_podotchet_litso,
        region_id,
      });
      if (!podotchet) {
        return res.error(req.i18n.t("podotchetNotFound"), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        type: "kassa_rasxod",
        id: child.spravochnik_operatsii_id,
      });
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }
      child.schet = operatsii.schet;

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

    const check = await KassaSaldoService.getByMonth({
      region_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const jur_schets = await MainSchetService.getJurSchets({ region_id });

    for (let child of childs) {
      const schet = jur_schets.find((item) => item.schet === child.schet);

      if (schet) {
        if (schet.type === "jur4") {
          const saldo = await Jur4SaldoService.getByMonth({
            main_schet_id,
            year,
            month,
            region_id,
            schet_id: schet.id,
          });
          if (!saldo) {
            return res.error(req.i18n.t("saldoNotFound"), 404);
          }
        }
      }
    }

    const result = await KassaRasxodService.create({
      ...req.body,
      ...req.query,
      jur_schets,
      main_schet_id,
      region_id,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const offset = (page - 1) * limit;

    const { data, total_count, summa, page_summa } =
      await KassaRasxodService.get({ region_id, offset, ...req.query });

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
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await KassaRasxodService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const { id_podotchet_litso, childs, doc_date } = req.body;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await KassaRasxodService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (id_podotchet_litso) {
      const podotchet = await PodotchetService.getById({
        id: id_podotchet_litso,
        region_id,
      });
      if (!podotchet) {
        return res.error(req.i18n.t("podotchetNotFound"), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        type: "kassa_rasxod",
        id: child.spravochnik_operatsii_id,
      });
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }

      child.schet = operatsii.schet;

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
      res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const check = await KassaSaldoService.getByMonth({
      region_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const jur_schets = await MainSchetService.getJurSchets({ region_id });

    for (let child of childs) {
      const schet = jur_schets.find((item) => item.schet === child.schet);

      if (schet) {
        if (schet.type === "jur4") {
          const saldo = await Jur4SaldoService.getByMonth({
            main_schet_id,
            year,
            month,
            region_id,
            schet_id: schet.id,
          });
          if (!saldo) {
            return res.error(req.i18n.t("saldoNotFound"), 404);
          }
        }
      }
    }

    const result = await KassaRasxodService.update({
      ...req.body,
      ...req.query,
      user_id,
      jur_schets,
      region_id,
      old_data: doc,
      id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await KassaRasxodService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const year = new Date(doc.doc_date).getFullYear();
    const month = new Date(doc.doc_date).getMonth() + 1;

    const check = await KassaSaldoService.getByMonth({
      region_id,
      year,
      month,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const jur_schets = await MainSchetService.getJurSchets({ region_id });

    for (let child of doc.childs) {
      const schet = jur_schets.find((item) => item.schet === child.schet);

      if (schet) {
        if (schet.type === "jur4") {
          const saldo = await Jur4SaldoService.getByMonth({
            main_schet_id,
            year,
            month,
            region_id,
            schet_id: schet.id,
          });
          if (!saldo) {
            return res.error(req.i18n.t("saldoNotFound"), 404);
          }
        }
      }
    }

    const result = await KassaRasxodService.delete({
      id,
      ...doc,
      ...req.query,
      region_id,
      jur_schets,
      main_schet_id,
      user_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
