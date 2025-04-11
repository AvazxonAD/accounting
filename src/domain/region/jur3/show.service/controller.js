const { MainSchetDB } = require("@main_schet/db");
const { OperatsiiDB } = require("@operatsii/db");
const { OrganizationDB } = require("@organization/db");
const { ContractDB } = require("@contract/db");
const {
  checkSchetsEquality,
  tashkentTime,
  HelperFunctions,
} = require("@helper/functions");
const { PodrazdelenieDB } = require("@podraz/db");
const { SostavDB } = require("@sostav/db");
const { TypeOperatsiiDB } = require("@type_operatsii/db");
const { ShowServiceDB } = require("./db");
const { db } = require("@db/index");
const { GaznaService } = require("@gazna/service");
const { AccountNumberService } = require("@account_number/service");
const { ShowServiceService } = require("./service");
const { Jur3SaldoService } = require(`@organ_saldo/service`);

exports.Controller = class {
  static async create(req, res) {
    const {
      id_spravochnik_organization,
      shartnomalar_organization_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
      doc_date,
      childs,
    } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id } = req.query;

    const main_schet = await MainSchetDB.getById([region_id, main_schet_id]);

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Jur3SaldoService.getByMonth({
      main_schet_id,
      year,
      month,
      region_id,
      schet_id,
    });

    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const organization = await OrganizationDB.getById([
      region_id,
      id_spravochnik_organization,
    ]);
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    if (!shartnomalar_organization_id && shartnoma_grafik_id) {
      return res.error(req.i18n.t("contractNotFound"), 404);
    }

    if (shartnomalar_organization_id) {
      const contract = await ContractDB.getById(
        [region_id, shartnomalar_organization_id],
        false,
        main_schet.spravochnik_budjet_name_id,
        id_spravochnik_organization
      );

      if (!contract || contract.pudratchi_bool) {
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

    for (let child of childs) {
      const operatsii = await OperatsiiDB.getById(
        [child.spravochnik_operatsii_id],
        "show_service",
        req.query.budjet_id
      );
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }
      if (child.id_spravochnik_podrazdelenie) {
        const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([
          region_id,
          child.id_spravochnik_podrazdelenie,
        ]);
        if (!podrazdelenie) {
          return res.error(req.i18n.t("podrazNotFound"), 404);
        }
      }
      if (child.id_spravochnik_sostav) {
        const sostav = await SostavDB.getById([
          region_id,
          child.id_spravochnik_sostav,
        ]);
        if (!sostav) {
          return res.error(req.i18n.t("sostavNotFound"), 404);
        }
      }
      if (child.id_spravochnik_type_operatsii) {
        const type_operatsii = await TypeOperatsiiDB.getById([
          region_id,
          child.id_spravochnik_type_operatsii,
        ]);
        if (!type_operatsii) {
          return res.error(req.i18n.t("typeOperatsiiNotFound"), 404);
        }
      }
    }
    const operatsiis = await OperatsiiDB.getOperatsiiByChildArray(
      childs,
      "show_service"
    );
    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const { dates, doc } = await ShowServiceService.create({
      ...req.body,
      ...req.query,
      user_id,
      region_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201, { dates }, doc);
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
      schet_id,
    } = req.query;

    const main_schet = await MainSchetDB.getById([region_id, main_schet_id]);

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const offset = (page - 1) * limit;
    const { data, summa, total_count } = await ShowServiceDB.get(
      [region_id, from, to, main_schet_id, offset, limit],
      search,
      order_by,
      order_type
    );

    let page_summa = 0;
    data.forEach((item) => {
      page_summa += item.summa;
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

    const main_schet = await MainSchetDB.getById([region_id, main_schet_id]);

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const result = await ShowServiceDB.getById(
      [region_id, id, main_schet_id],
      true
    );
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.error(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const {
      doc_date,
      id_spravochnik_organization,
      shartnomalar_organization_id,
      childs,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
    } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id } = req.query;
    const id = req.params.id;

    const old_data = await ShowServiceDB.getById([
      region_id,
      id,
      main_schet_id,
    ]);
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Jur3SaldoService.getByMonth({
      main_schet_id,
      year,
      month,
      region_id,
      schet_id,
    });

    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const main_schet = await MainSchetDB.getById([region_id, main_schet_id]);

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const organization = await OrganizationDB.getById([
      region_id,
      id_spravochnik_organization,
    ]);
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    if (!shartnomalar_organization_id && shartnoma_grafik_id) {
      return res.error(req.i18n.t("contractNotFound"), 404);
    }

    if (shartnomalar_organization_id) {
      const contract = await ContractDB.getById(
        [region_id, shartnomalar_organization_id],
        false,
        main_schet.spravochnik_budjet_name_id,
        id_spravochnik_organization
      );

      if (!contract || contract.pudratchi_bool) {
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

    for (let child of childs) {
      const operatsii = await OperatsiiDB.getById(
        [child.spravochnik_operatsii_id],
        "show_service",
        req.query.budjet_id
      );
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }
      if (child.id_spravochnik_podrazdelenie) {
        const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([
          region_id,
          child.id_spravochnik_podrazdelenie,
        ]);
        if (!podrazdelenie) {
          return res.error(req.i18n.t("podrazNotFound"), 404);
        }
      }
      if (child.id_spravochnik_sostav) {
        const sostav = await SostavDB.getById([
          region_id,
          child.id_spravochnik_sostav,
        ]);
        if (!sostav) {
          return res.error(req.i18n.t("sostavNotFound"), 404);
        }
      }
      if (child.id_spravochnik_type_operatsii) {
        const type_operatsii = await TypeOperatsiiDB.getById([
          region_id,
          child.id_spravochnik_type_operatsii,
        ]);
        if (!type_operatsii) {
          return res.error(req.i18n.t("typeOperatsiiNotFound"), 404);
        }
      }
    }
    const operatsiis = await OperatsiiDB.getOperatsiiByChildArray(
      childs,
      "show_service"
    );
    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const { dates, doc } = await ShowServiceService.update({
      ...req.query,
      ...req.body,
      id,
      user_id,
      region_id,
      old_data,
    });

    return res.success(req.i18n.t("createSuccess"), 201, { dates }, doc);
  }

  static async delete(req, res) {
    const { main_schet_id, schet_id } = req.query;
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const id = req.params.id;

    const main_schet = await MainSchetDB.getById([region_id, main_schet_id]);

    const schet = main_schet.jur3_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const doc = await ShowServiceDB.getById([region_id, id, main_schet_id]);
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const data = await ShowServiceService.delete({
      id,
      region_id,
      main_schet_id,
      schet_id,
      user_id,
      ...doc,
    });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, data);
  }
};
