const { ContractService } = require("@contract/service");
const { GroupService } = require("@group/service");
const { PrixodJur7Service } = require("./service");
const { OrganizationService } = require("@organization/service");
const { BudjetService } = require("@budjet/service");
const { ResponsibleService } = require("@responsible/service");
const { GaznaService } = require("@gazna/service");
const { AccountNumberService } = require("@account_number/service");
const { HelperFunctions } = require("@helper/functions");
const { CODE } = require("@helper/constants");
const { PrixodJur7Schema } = require("./schema");
const { Jur7SaldoService } = require(`@jur7_saldo/service`);
const { MainSchetService } = require(`@main_schet/service`);
const { ValidatorFunctions } = require(`@helper/database.validator`);
const { RegionService } = require("@region/service");
const { PodpisService } = require("../../spravochnik/podpis/service");
const { UnitService } = require("@unit/service");

exports.Controller = class {
  static async rasxodDocs(req, res) {
    const id = req.params.id;

    const productIds = await PrixodJur7Service.getProductIds({ id });
    const result = [];

    for (let id of productIds) {
      result.push(await PrixodJur7Service.checkPrixodDoc({ product_id: id }));
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async templateImport(req, res) {
    const { fileName, fileRes } = await HelperFunctions.returnTemplateFile("prixod.xlsx", req.i18n);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.send(fileRes);
  }

  static async readFile(req, res) {
    const filePath = req.file.path;

    const { result: data, header } = await HelperFunctions.readFile(filePath);

    for (let item of data) {
      const { error } = PrixodJur7Schema.import(req.i18n).validate(item);
      if (error) {
        return res.error(error.details[0].message, 400, {
          code: CODE.EXCEL_IMPORT.code,
          doc: item,
          header,
        });
      }
    }

    for (let item of data) {
      item.iznos = item.iznos === "ha" ? true : false;

      item.nds_summa = item.nds_foiz ? (item.nds_foiz / 100) * item.summa : 0;

      item.summa_s_nds = item.summa + item.nds_summa;

      item.group = await GroupService.getById({ id: item.group_jur7_id });
      if (!item.group) {
        return res.error(req.i18n.t("groupNotFound"), 404);
      }

      item.iznos = item.group.iznos_foiz > 0 ? true : false;
      item.iznos_schet = item.group.schet;
      item.iznos_sub_schet = item.group.provodka_subschet;

      item.sena = item.summa / item.kol;
    }

    return res.success(req.i18n.t("readFileSuccess"), 200, null, data);
  }

  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { budjet_id, main_schet_id } = req.query;

    const {
      kimdan_id,
      kimga_id,
      id_shartnomalar_organization,
      childs,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
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
      id: kimdan_id,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    const responsible = await ResponsibleService.getById({
      region_id,
      id: kimga_id,
      budjet_id: req.query.budjet_id,
    });
    if (!responsible) {
      return res.error(req.i18n.t("responsibleNotFound"), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({
        region_id,
        id: id_shartnomalar_organization,
        main_schet_id,
      });
      if (!contract) {
        return res.error(req.i18n.t("contractNotFound"), 404);
      }

      if (shartnoma_grafik_id) {
        const grafik = contract.grafiks.find((item) => item.id === shartnoma_grafik_id);
        if (!grafik) {
          return res.error(req.i18n.t("grafikNotFound"), 404);
        }
      }
    }

    if (organization_by_raschet_schet_id) {
      const account_number = await AccountNumberService.getById({
        organ_id: kimdan_id,
        id: organization_by_raschet_schet_id,
      });
      if (!account_number) {
        return res.error(req.i18n.t("account_number_not_found"), 404);
      }
    }

    if (organization_by_raschet_schet_gazna_id) {
      const gazna = await GaznaService.getById({
        organ_id: kimdan_id,
        id: organization_by_raschet_schet_gazna_id,
      });
      if (!gazna) {
        return res.error(req.i18n.t("gazna_not_found"), 404);
      }
    }

    for (let child of childs) {
      child.group = await GroupService.getById({ id: child.group_jur7_id });
      if (!child.group) {
        return res.error(req.i18n.t("groupNotFound"), 404);
      }

      const unit = await UnitService.getById({ id: child.unit_id });
      if (!unit) {
        return res.error(req.i18n.t("unitNotFound"), 404);
      }

      child.old_iznos = child.eski_iznos_summa;

      if (child.saldo_id) {
        const saldo = await Jur7SaldoService.getById({ region_id, id: child.saldo_id, main_schet_id });
        if (!saldo) return res.error(req.i18n.t("saldoNotFound"), 404);

        if (saldo.responsible_id != kimga_id) return res.error(req.i18n.t("validationError"), 400);

        if (saldo.product_id != child.product_id) return res.error(req.i18n.t("validationError"), 400);

        child.saldo = saldo;
      }

      if (child.product_id) {
        const product = await Jur7SaldoService.getByIdProduct({ id: child.product_id, region_id });
        if (!product) return res.error(req.i18n.t("productNotFound"), 404);
      }

      if ((child.saldo_id && !child.product_id) || (!child.saldo_id && child.product_id)) {
        return res.error(req.i18n.t("validationError"), 400);
      }
    }

    const check_saldo = await Jur7SaldoService.check({
      region_id,
      main_schet_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
    });

    if (!check_saldo.result.length) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const result = await PrixodJur7Service.create({
      ...req.body,
      ...req.query,
      user_id,
      childs,
      region_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, result.dates, result.doc);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, budjet_id, main_schet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const offset = (page - 1) * limit;

    const { data, total, summa } = await PrixodJur7Service.get({
      region_id,
      ...req.query,
      offset,
    });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      summa,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data || []);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id, main_schet_id, akt } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const data = await PrixodJur7Service.getById({
      ...req.query,
      region_id,
      id,
      isdeleted: true,
    });
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (akt === "true") {
      const podpis = await PodpisService.get({ region_id, type: "akt_jur7" });

      const region = await RegionService.getById({ id: region_id });

      const { fileName, filePath } = await PrixodJur7Service.aktExcel({
        ...data,
        region,
        podpis,
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const { budjet_id, main_schet_id } = req.query;
    const {
      kimdan_id,
      kimga_id,
      id_shartnomalar_organization,
      childs,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
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

    const old_data = await PrixodJur7Service.getById({
      region_id,
      id,
      ...req.query,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const productIds = await PrixodJur7Service.getProductIds({ id });

    for (let id of productIds) {
      const check = await PrixodJur7Service.checkPrixodDoc({ product_id: id });
      if (check.length) {
        return res.error(req.i18n.t("rasxodProductError"), 409, {
          code: CODE.DOCS_HAVE.code,
          docs: check,
        });
      }
    }

    const responsible = await ResponsibleService.getById({
      region_id,
      id: kimga_id,
      budjet_id: req.query.budjet_id,
    });
    if (!responsible) {
      return res.error(req.i18n.t("responsibleNotFound"), 404);
    }

    const organization = await OrganizationService.getById({
      region_id,
      id: kimdan_id,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({
        region_id,
        id: id_shartnomalar_organization,
        main_schet_id,
      });
      if (!contract) {
        return res.error(req.i18n.t("contractNotFound"), 404);
      }

      if (shartnoma_grafik_id) {
        const grafik = contract.grafiks.find((item) => item.id === shartnoma_grafik_id);
        if (!grafik) {
          return res.error(req.i18n.t("grafikNotFound"), 404);
        }
      }
    }

    if (organization_by_raschet_schet_id) {
      const account_number = await AccountNumberService.getById({
        organ_id: kimdan_id,
        id: organization_by_raschet_schet_id,
      });
      if (!account_number) {
        return res.error(req.i18n.t("account_number_not_found"), 404);
      }
    }

    if (organization_by_raschet_schet_gazna_id) {
      const gazna = await GaznaService.getById({
        organ_id: kimdan_id,
        id: organization_by_raschet_schet_gazna_id,
      });
      if (!gazna) {
        return res.error(req.i18n.t("gazna_not_found"), 404);
      }
    }

    for (let child of childs) {
      child.group = await GroupService.getById({ id: child.group_jur7_id });
      if (!child.group) {
        return res.error(req.i18n.t("groupNotFound"), 404);
      }

      const unit = await UnitService.getById({ id: child.unit_id });
      if (!unit) {
        return res.error(req.i18n.t("unitNotFound"), 404);
      }

      child.old_iznos = child.eski_iznos_summa;

      if (child.saldo_id) {
        const saldo = await Jur7SaldoService.getById({ region_id, id: child.saldo_id, main_schet_id });
        if (!saldo) return res.error(req.i18n.t("saldoNotFound"), 404);

        if (saldo.responsible_id != kimga_id) return res.error(req.i18n.t("validationError"), 400);

        if (saldo.product_id != child.product_id) return res.error(req.i18n.t("validationError"), 400);

        child.saldo = saldo;
      }

      if (child.product_id) {
        const product = await Jur7SaldoService.getByIdProduct({ id: child.product_id, region_id });
        if (!product) return res.error(req.i18n.t("productNotFound"), 404);
      }

      if ((child.saldo_id && !child.product_id) || (!child.saldo_id && child.product_id)) {
        child.saldo_id = null;
        child.product_id = null;
        // return res.error(req.i18n.t("validationError"), 400);
      }
    }

    const check_saldo = await Jur7SaldoService.check({
      region_id,
      main_schet_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
    });
    if (!check_saldo.result.length) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const result = await PrixodJur7Service.update({
      ...req.body,
      ...req.query,
      user_id,
      id,
      childs,
      old_data,
      region_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, result.dates, result.doc);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id, main_schet_id } = req.query;
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

    const old_data = await PrixodJur7Service.getById({
      region_id,
      id,
      ...req.query,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const check_saldo = await Jur7SaldoService.check({
      region_id,
      main_schet_id,
      year: new Date(old_data.doc_date).getFullYear(),
      month: new Date(old_data.doc_date).getMonth() + 1,
    });
    if (!check_saldo.result.length) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const productIds = await PrixodJur7Service.getProductIds({ id });

    for (let id of productIds) {
      const check = await PrixodJur7Service.checkPrixodDoc({ product_id: id });
      if (check.length) {
        return res.error(req.i18n.t("rasxodProductError"), 409, {
          code: CODE.DOCS_HAVE.code,
          docs: check,
        });
      }
    }

    const result = await PrixodJur7Service.deleteDoc({
      ...old_data,
      ...req.query,
      id,
      region_id,
      user_id,
      old_data,
    });

    return res.success(req.i18n.t("deleteSuccess"), 200, result.dates, result.doc);
  }

  static async getPrixodReport(req, res) {
    const region_id = req.user.region_id;
    const { from, to, main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const { fileName, filePath } = await PrixodJur7Service.prixodReport({
      main_schet_id,
      region_id,
      from,
      to,
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.sendFile(filePath);
  }
};
