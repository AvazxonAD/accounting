const { checkSchetsEquality, HelperFunctions } = require("@helper/functions");
const { MainSchetService } = require("@main_schet/service");
const { PodotchetService } = require("@podotchet/service");
const { OperatsiiService } = require("@operatsii/service");
const { PodrazdelenieService } = require("@podraz/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { KassaPrixodService } = require("./service");
const { KassaSaldoService } = require(`@jur1_saldo/service`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);
const { OrganizationService } = require("@organization/service");
const { ContractService } = require("@contract/service");
const { AccountNumberService } = require("@account_number/service");
const { GaznaService } = require("@gazna/service");

exports.Controller = class {
  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const {
      id_podotchet_litso,
      childs,
      organ_id,
      contract_id,
      contract_grafik_id,
      organ_account_id,
      organ_gazna_id,
      doc_date,
      type,
    } = req.body;

    if (type === "organ" && !organ_id) {
      return res.error(req.i18n.t("validationError", 400));
    }

    if (type === "podotchet" && !id_podotchet_litso) {
      return res.error(req.i18n.t("validationError", 400));
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const year = new Date(doc_date).getFullYear();
    const month = new Date(doc_date).getMonth() + 1;

    const check = await KassaSaldoService.getByMonth({
      region_id,
      year,
      month,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
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

    if (organ_id) {
      const organization = await OrganizationService.getById({
        region_id,
        id: organ_id,
      });
      if (!organization) {
        return res.error(req.i18n.t("organizationNotFound"), 404);
      }
    }

    if (!contract_id && contract_grafik_id) {
      return res.error(req.i18n.t("contractNotFound"), 404);
    }

    if (contract_id) {
      const contract = await ContractService.getById({
        region_id,
        id: contract_id,
        main_schet_id,
      });
      if (!contract) {
        return res.error(req.i18n.t("contractNotFound"), 404);
      }

      if (contract_grafik_id) {
        const grafik = contract.grafiks.find(
          (item) => item.id === contract_grafik_id
        );
        if (!grafik) {
          return res.error(req.i18n.t("grafikNotFound"), 404);
        }
      }
    }

    if (organ_account_id) {
      const account_number = await AccountNumberService.getById({
        organ_id,
        id: organ_account_id,
      });
      if (!account_number) {
        return res.error(req.i18n.t("account_number_not_found"), 404);
      }
    }

    if (organ_gazna_id) {
      const gazna = await GaznaService.getById({
        organ_id,
        id: organ_gazna_id,
      });
      if (!gazna) {
        return res.error(req.i18n.t("gazna_not_found"), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        type: "kassa_prixod",
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

    const jur_schets = await MainSchetService.getJurSchets({
      region_id,
      main_schet_id,
    });

    for (let child of childs) {
      const schet = jur_schets.find((item) => item.schet === child.schet);

      if (schet) {
        if (schet.type === "jur4") {
          // const saldo = await Jur4SaldoService.getByMonth({
          //   main_schet_id,
          //   year,
          //   month,
          //   region_id,
          //   schet_id: schet.id,
          // });
          // if (!saldo) {
          //   return res.error(req.i18n.t("saldoNotFound"), 404);
          // }
        }
      }
    }

    const result = await KassaPrixodService.create({
      ...req.body,
      main_schet_id,
      jur_schets,
      region_id,
      user_id,
      ...req.query,
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
    const { page, limit, main_schet_id, from } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const offset = (page - 1) * limit;
    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: from,
    });

    const saldo = await KassaSaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });

    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { data, total_count, summa, page_summa } =
      await KassaPrixodService.get({ ...req.query, region_id, offset });

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

    const result = await KassaPrixodService.getById({
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
    const {
      id_podotchet_litso,
      childs,
      doc_date,
      organ_id,
      contract_id,
      contract_grafik_id,
      organ_account_id,
      organ_gazna_id,
      type,
    } = req.body;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await KassaPrixodService.getById({
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

    if (type === "organ" && !organ_id) {
      return res.error(req.i18n.t("validationError", 400));
    }

    if (type === "podotchet" && !id_podotchet_litso) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (organ_id) {
      const organization = await OrganizationService.getById({
        region_id,
        id: organ_id,
      });
      if (!organization) {
        return res.error(req.i18n.t("organizationNotFound"), 404);
      }
    }

    if (!contract_id && contract_grafik_id) {
      return res.error(req.i18n.t("contractNotFound"), 404);
    }

    if (contract_id) {
      const contract = await ContractService.getById({
        region_id,
        id: contract_id,
        main_schet_id,
      });
      if (!contract) {
        return res.error(req.i18n.t("contractNotFound"), 404);
      }

      if (contract_grafik_id) {
        const grafik = contract.grafiks.find(
          (item) => item.id === contract_grafik_id
        );
        if (!grafik) {
          return res.error(req.i18n.t("grafikNotFound"), 404);
        }
      }
    }

    if (organ_account_id) {
      const account_number = await AccountNumberService.getById({
        organ_id,
        id: organ_account_id,
      });
      if (!account_number) {
        return res.error(req.i18n.t("account_number_not_found"), 404);
      }
    }

    if (organ_gazna_id) {
      const gazna = await GaznaService.getById({
        organ_id,
        id: organ_gazna_id,
      });
      if (!gazna) {
        return res.error(req.i18n.t("gazna_not_found"), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        type: "kassa_prixod",
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

    const year = new Date(doc_date).getFullYear();
    const month = new Date(doc_date).getMonth() + 1;

    const check = await KassaSaldoService.getByMonth({
      region_id,
      year,
      month,
      main_schet_id,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const jur_schets = await MainSchetService.getJurSchets({
      region_id,
      main_schet_id,
    });

    for (let child of childs) {
      const schet = jur_schets.find((item) => item.schet === child.schet);

      if (schet) {
        if (schet.type === "jur4") {
          // const saldo = await Jur4SaldoService.getByMonth({
          //   main_schet_id,
          //   year,
          //   month,
          //   region_id,
          //   schet_id: schet.id,
          // });
          // if (!saldo) {
          //   return res.error(req.i18n.t("saldoNotFound"), 404);
          // }
        }
      }
    }

    const result = await KassaPrixodService.update({
      ...req.body,
      main_schet_id,
      user_id,
      region_id,
      old_data: doc,
      jur_schets,
      ...req.query,
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

    const doc = await KassaPrixodService.getById({
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

    const jur_schets = await MainSchetService.getJurSchets({
      region_id,
      main_schet_id,
    });

    for (let child of doc.childs) {
      const schet = jur_schets.find((item) => item.schet === child.schet);

      if (schet) {
        if (schet.type === "jur4") {
          // const saldo = await Jur4SaldoService.getByMonth({
          //   main_schet_id,
          //   year,
          //   month,
          //   region_id,
          //   schet_id: schet.id,
          // });
          // if (!saldo) {
          //   return res.error(req.i18n.t("saldoNotFound"), 404);
          // }
        }
      }
    }

    const result = await KassaPrixodService.delete({
      id,
      ...doc,
      region_id,
      user_id,
      jur_schets,
      ...req.query,
    });

    return res.success(
      req.i18n.t("getSuccess"),
      200,
      { dates: result.dates },
      result.doc
    );
  }
};
