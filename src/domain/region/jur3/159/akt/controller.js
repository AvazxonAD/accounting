const { checkSchetsEquality, HelperFunctions } = require("@helper/functions");
const { PodrazdelenieService } = require("@podraz/service");
const { MainSchetService } = require("@main_schet/service");
const { AktService } = require("./service");
const { ContractService } = require("@contract/service");
const { OperatsiiService } = require("@operatsii/service");
const { OrganizationService } = require("@organization/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { GaznaService } = require("@gazna/service");
const { AccountNumberService } = require("@account_number/service");
const { RegionService } = require("@region/service");
const { Saldo159Service } = require(`@saldo_159/service`);
const { BudjetService } = require("@budjet/service");

exports.Controller = class {
  static async create(req, res) {
    const {
      id_spravochnik_organization,
      shartnomalar_organization_id,
      childs,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
      doc_date,
    } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id, budjet_id } = req.query;

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

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Saldo159Service.getByMonth({
      main_schet_id,
      year,
      month,
      region_id,
      schet_id,
    });

    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const organization = await OrganizationService.getById({
      region_id,
      id: id_spravochnik_organization,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    if (!shartnomalar_organization_id && shartnoma_grafik_id) {
      return res.error(req.i18n.t("contractNotFound"), 404);
    }

    if (shartnomalar_organization_id) {
      const contract = await ContractService.getById({
        region_id,
        id: shartnomalar_organization_id,
      });
      if (!contract || !contract.pudratchi_bool) {
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
        id: child.spravochnik_operatsii_id,
        type: "akt",
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

      child.summa = child.kol * child.sena;
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
      search,
      order_by,
      order_type,
      schet_id,
    } = req.query;

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

    const offset = (page - 1) * limit;
    const { summa, total, data, page_summa } = await AktService.get({
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

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
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

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await AktService.getById({
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
    const {
      id_spravochnik_organization,
      shartnomalar_organization_id,
      childs,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      shartnoma_grafik_id,
      doc_date,
    } = req.body;

    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id, budjet_id } = req.query;
    const id = req.params.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const old_data = await AktService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
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

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Saldo159Service.getByMonth({
      main_schet_id,
      year,
      month,
      region_id,
      schet_id,
    });

    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const organization = await OrganizationService.getById({
      region_id,
      id: id_spravochnik_organization,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    if (!shartnomalar_organization_id && shartnoma_grafik_id) {
      return res.error(req.i18n.t("contractNotFound"), 404);
    }

    if (shartnomalar_organization_id) {
      const contract = await ContractService.getById({
        region_id,
        id: shartnomalar_organization_id,
      });
      if (!contract || !contract.pudratchi_bool) {
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
        id: child.spravochnik_operatsii_id,
        type: "akt",
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

      child.summa = child.kol * child.sena;
    }

    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const result = await AktService.update({
      ...req.body,
      ...req.query,
      old_data,
      region_id,
      user_id,
      id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const { main_schet_id, schet_id, budjet_id } = req.query;
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

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const old_doc = await AktService.getById({ region_id, main_schet_id, id });
    if (!old_doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: old_doc.doc_date,
    });

    const saldo = await Saldo159Service.getByMonth({
      main_schet_id,
      year,
      month,
      region_id,
      schet_id,
    });

    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { dates, doc } = await AktService.delete({
      ...old_doc,
      ...req.query,
      id,
      region_id,
      user_id,
    });

    return res.success(req.i18n.t("deleteSuccess"), 200, { dates }, doc);
  }

  static async cap(req, res) {
    const region_id = req.user.region_id;
    const region = await RegionService.getById({ id: region_id });

    const { from, to, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const schets = await AktService.getSchets({
      region_id,
      main_schet_id,
      from,
      to,
    });

    const { fileName, filePath } = await AktService.capExcel({
      ...req.query,
      region_id,
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
  static async cap(req, res) {
    const region_id = req.user.region_id;
    const region = await RegionService.getById({ id: region_id });

    const { from, to, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const schets = await AktService.getSchets({
      region_id,
      main_schet_id,
      from,
      to,
    });

    const { fileName, filePath } = await AktService.capExcel({
      ...req.query,
      region_id,
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
};
