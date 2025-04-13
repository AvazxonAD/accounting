const { checkSchetsEquality, HelperFunctions } = require("@helper/functions");
const { MainSchetService } = require("@main_schet/service");
const { PodotchetService } = require("@podotchet/service");
const { OperatsiiService } = require("@operatsii/service");
const { PodrazdelenieService } = require("@podraz/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { BankRasxodService } = require("./service");
const { OrganizationService } = require("@organization/service");
const { ContractService } = require("@contract/service");
const { GaznaService } = require("@gazna/service");
const { AccountNumberService } = require("@account_number/service");
const { BankSaldoService } = require(`@jur2_saldo/service`);

exports.Controller = class {
  static async import(req, res) {
    const { docs } = req.body;
    const { region_id, id: user_id } = req.user;
    const { main_schet_id, budjet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const year = 2024 || new Date().getFullYear();
    const month = 12; // new Date().getMonth() + 1;

    const jur_schets = await MainSchetService.getJurSchets({ region_id });
    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    for (let doc of docs) {
      for (let child of doc.childs) {
        const operatsii = await OperatsiiService.getById({
          type: "bank_rasxod",
          id: child.spravochnikOperatsiiId,
        });
        if (!operatsii) {
          return res.error(req.i18n.t("operatsiiNotFound"), 404);
        }
        child.schet = jur_schets.find((item) => item.schet === operatsii.schet);
      }
    }

    const check = await BankSaldoService.getByMonth({
      region_id,
      year,
      month,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const date = HelperFunctions.returnDate({ year, month });

    const dates = await BankRasxodService.import({
      ...req.query,
      docs,
      user_id,
      main_schet,
      region_id,
      doc_date: date,
    });

    return res.success(req.i18n.t("createSuccess"), 200, { dates }, {});
  }

  static async payment(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { main_schet_id, budjet_id } = req.query;
    const user_id = req.user.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const bank_rasxod = await BankRasxodService.getById({
      id,
      main_schet_id,
      region_id,
    });
    if (!bank_rasxod) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const check = await BankSaldoService.getByMonth({
      region_id,
      year: new Date(bank_rasxod.doc_date).getFullYear(),
      month: new Date(bank_rasxod.doc_date).getMonth() + 1,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const jur_schets = await MainSchetService.getJurSchets({ region_id });

    const result = await BankRasxodService.payment({
      ...req.query,
      ...bank_rasxod,
      ...req.body,
      id,
      user_id,
      jur_schets,
      main_schet,
      region_id,
    });

    return res.success(
      req.i18n.t("updateSuccess"),
      200,
      { dates: result.dates },
      result.doc
    );
  }

  static async fio(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const result = await BankRasxodService.fio({ main_schet_id, region_id });

    return res.success(req.i18n.t("getSuccess"), 200, req.query, result);
  }

  static async create(req, res) {
    const { main_schet_id, budjet_id } = req.query;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const {
      id_spravochnik_organization,
      id_shartnomalar_organization,
      childs,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
      doc_date,
    } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const organization = await OrganizationService.getById({
      region_id,
      id: id_spravochnik_organization,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    if (!id_shartnomalar_organization && shartnoma_grafik_id) {
      return res.error(req.i18n.t("contractNotFound"), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({
        region_id,
        id: id_shartnomalar_organization,
      });
      if (!contract) {
        return res.error(req.i18n.t("contractNotFound"), 404);
      }

      if (shartnoma_grafik_id) {
        const grafik = contract.grafiks.find(
          (item) => item.id === shartnoma_grafik_id
        );
        if (!grafik) {
          return res.error(req.i18n.t("grafikNotFound"), 404);
        }
      }
    }

    if (organization_by_raschet_schet_id) {
      const account_number = await AccountNumberService.getById({
        organ_id: id_spravochnik_organization,
        id: organization_by_raschet_schet_id,
      });
      if (!account_number) {
        return res.error(req.i18n.t("account_number_not_found"), 404);
      }
    }

    if (organization_by_raschet_schet_gazna_id) {
      const gazna = await GaznaService.getById({
        organ_id: id_spravochnik_organization,
        id: organization_by_raschet_schet_gazna_id,
      });
      if (!gazna) {
        return res.error(req.i18n.t("gazna_not_found"), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        type: "bank_rasxod",
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

      if (child.id_spravochnik_podotchet_litso) {
        const podotchet = await PodotchetService.getById({
          id: child.id_spravochnik_podotchet_litso,
          region_id,
        });
        if (!podotchet) {
          return res.error(req.i18n.t("podotchetNotFound"), 404);
        }
      }
    }

    const jur_schets = await MainSchetService.getJurSchets({ region_id });

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const check = await BankSaldoService.getByMonth({
      region_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const result = await BankRasxodService.create({
      ...req.body,
      ...req.query,
      main_schet,
      user_id,
      jur_schets,
      region_id,
    });

    return res.success(
      req.i18n.t("createSuccess"),
      201,
      { dates: result.dates },
      result.doc
    );
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const {
      page,
      limit,
      from,
      to,
      main_schet_id,
      search,
      order_by,
      order_type,
    } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const offset = (page - 1) * limit;

    const { data, total_count, summa, page_summa } =
      await BankRasxodService.get({
        search,
        region_id,
        main_schet_id,
        from,
        to,
        offset,
        limit,
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

    const result = await BankRasxodService.getById({
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
    const { main_schet_id, budjet_id } = req.query;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const {
      id_spravochnik_organization,
      id_shartnomalar_organization,
      childs,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
      doc_date,
    } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await BankRasxodService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const organization = await OrganizationService.getById({
      region_id,
      id: id_spravochnik_organization,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({
        region_id,
        id: id_shartnomalar_organization,
      });
      if (!contract) {
        return res.error(req.i18n.t("contractNotFound"), 404);
      }

      if (shartnoma_grafik_id) {
        const grafik = contract.grafiks.find(
          (item) => item.id === shartnoma_grafik_id
        );
        if (!grafik) {
          return res.error(req.i18n.t("grafikNotFound"), 404);
        }
      }
    }

    if (organization_by_raschet_schet_id) {
      const account_number = await AccountNumberService.getById({
        organ_id: id_spravochnik_organization,
        id: organization_by_raschet_schet_id,
      });
      if (!account_number) {
        return res.error(req.i18n.t("account_number_not_found"), 404);
      }
    }

    if (organization_by_raschet_schet_gazna_id) {
      const gazna = await GaznaService.getById({
        organ_id: id_spravochnik_organization,
        id: organization_by_raschet_schet_gazna_id,
      });
      if (!gazna) {
        return res.error(req.i18n.t("gazna_not_found"), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        type: "bank_rasxod",
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

      if (child.id_spravochnik_podotchet_litso) {
        const podotchet = await PodotchetService.getById({
          id: child.id_spravochnik_podotchet_litso,
          region_id,
        });
        if (!podotchet) {
          return res.error(req.i18n.t("podotchetNotFound"), 404);
        }
      }
    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const check = await BankSaldoService.getByMonth({
      region_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const jur_schets = await MainSchetService.getJurSchets({ region_id });

    const result = await BankRasxodService.update({
      ...req.body,
      ...req.query,
      user_id,
      region_id,
      jur_schets,
      main_schet,
      old_data: doc,
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
    const { main_schet_id, budjet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await BankRasxodService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const check = await BankSaldoService.getByMonth({
      region_id,
      year: new Date(doc.doc_date).getFullYear(),
      month: new Date(doc.doc_date).getMonth() + 1,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const jur_schets = await MainSchetService.getJurSchets({ region_id });

    const result = await BankRasxodService.delete({
      ...req.query,
      ...doc,
      id,
      region_id,
      main_schet,
      jur_schets,
      user_id,
    });

    return res.success(
      req.i18n.t("deleteSuccess"),
      200,
      { dates: result.dates },
      result.doc
    );
  }
};
