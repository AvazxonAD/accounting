const { MainSchetDB } = require("@main_schet/db");
const { OperatsiiDB } = require("@operatsii/db");
const { OrganizationDB } = require("@organization/db");
const { ContractDB } = require("@contract/db");
const { checkSchetsEquality, tashkentTime } = require("@helper/functions");
const { PodrazdelenieDB } = require("../spravochnik/podrazdelenie/db");
const { SostavDB } = require("../spravochnik/sostav/db");
const { TypeOperatsiiDB } = require("../spravochnik/type.operatsii/db");
const { ShowServiceDB } = require("./db");
const { db } = require("@db/index");
const { GaznaService } = require("@gazna/service");
const { AccountNumberService } = require("@account_number/service");

exports.Controller = class {
  static async createShowService(req, res) {
    const {
      doc_num,
      doc_date,
      opisanie,
      id_spravochnik_organization,
      shartnomalar_organization_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
      childs,
    } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetDB.getByIdMainSchet([
      region_id,
      main_schet_id,
    ]);
    if (!main_schet) {
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
    let summa = 0;
    for (let child of childs) {
      summa += child.kol * child.sena;
    }
    let doc;
    await db.transaction(async (client) => {
      doc = await ShowServiceDB.createShowService(
        [
          user_id,
          doc_num,
          doc_date,
          summa,
          opisanie,
          id_spravochnik_organization,
          shartnomalar_organization_id,
          main_schet_id,
          organization_by_raschet_schet_id,
          organization_by_raschet_schet_gazna_id,
          shartnoma_grafik_id,
          tashkentTime(),
          tashkentTime(),
        ],
        client
      );
      const result_childs = childs.map((item) => {
        item.summa = item.kol * item.sena;
        if (item.nds_foiz) {
          item.nds_summa = (item.nds_foiz / 100) * item.summa;
        } else {
          item.nds_summa = 0;
        }
        item.summa_s_nds = item.summa + item.nds_summa;
        item.created_at = tashkentTime();
        item.updated_at = tashkentTime();
        item.main_schet_id = main_schet_id;
        item.user_id = user_id;
        item.kursatilgan_hizmatlar_jur152_id = doc.id;
        return item;
      });
      const items = await ShowServiceDB.createShowServiceChild(
        result_childs,
        client
      );
      doc.childs = items;
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, doc);
  }

  static async getShowService(req, res) {
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

    const main_schet = await MainSchetDB.getByIdMainSchet([
      region_id,
      main_schet_id,
    ]);
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const offset = (page - 1) * limit;
    const { data, summa, total_count } = await ShowServiceDB.getShowService(
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

  static async getByIdShowService(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet = await MainSchetDB.getByIdMainSchet([
      region_id,
      main_schet_id,
    ]);
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }
    const result = await ShowServiceDB.getByIdShowService(
      [region_id, id, main_schet_id],
      true
    );
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.error(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async updateShowService(req, res) {
    const {
      doc_num,
      doc_date,
      opisanie,
      id_spravochnik_organization,
      shartnomalar_organization_id,
      childs,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
    } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;

    const old_data = await ShowServiceDB.getByIdShowService([
      region_id,
      id,
      main_schet_id,
    ]);
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const main_schet = await MainSchetDB.getByIdMainSchet([
      region_id,
      main_schet_id,
    ]);
    if (!main_schet) {
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
    let summa = 0;
    for (let child of childs) {
      summa += child.kol * child.sena;
    }
    let doc;
    await db.transaction(async (client) => {
      doc = await ShowServiceDB.updateShowService(
        [
          doc_num,
          doc_date,
          opisanie,
          summa,
          id_spravochnik_organization,
          shartnomalar_organization_id,
          tashkentTime(),
          organization_by_raschet_schet_id,
          organization_by_raschet_schet_gazna_id,
          shartnoma_grafik_id,
          id,
        ],
        client
      );
      await ShowServiceDB.deleteShowServiceChild([id], client);
      const result_childs = childs.map((item) => {
        item.summa = item.kol * item.sena;
        if (item.nds_foiz) {
          item.nds_summa = (item.nds_foiz / 100) * item.summa;
        } else {
          item.nds_summa = 0;
        }
        item.summa_s_nds = item.summa + item.nds_summa;
        item.created_at = tashkentTime();
        item.updated_at = tashkentTime();
        item.main_schet_id = main_schet_id;
        item.user_id = user_id;
        item.kursatilgan_hizmatlar_jur152_id = doc.id;
        return item;
      });
      const items = await ShowServiceDB.createShowServiceChild(
        result_childs,
        client
      );
      doc.childs = items;
    });
    return res.success(req.i18n.t("createSuccess"), 201, null, doc);
  }

  static async deleteShowService(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet = await MainSchetDB.getByIdMainSchet([
      region_id,
      main_schet_id,
    ]);
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }
    const result = await ShowServiceDB.getByIdShowService([
      region_id,
      id,
      main_schet_id,
    ]);
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const data = await db.transaction(async (client) => {
      const docId = await ShowServiceDB.deleteShowService([id], client);

      return docId;
    });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, data);
  }
};
