const { ContractService } = require('@contract/service');
const { GroupService } = require('@group/service');
const { PrixodJur7Service } = require('./service');
const { MainSchetService } = require('@main_schet/service');
const { OrganizationService } = require('@organization/service');
const { BudjetService } = require('@budjet/service');
const { ResponsibleService } = require('@responsible/service');
const { GaznaService } = require('@gazna/service');
const { AccountNumberService } = require('@account_number/service');
const { HelperFunctions } = require('@helper/functions');
const { CODE } = require('@helper/constants');
const { PrixodJur7Schema } = require('./schema')

exports.Controller = class {
  static async rasxodDocs(req, res) {
    const id = req.params.id;

    const productIds = await PrixodJur7Service.getProductIds({ id });
    const result = [];

    for (let id of productIds) {
      result.push(await PrixodJur7Service.checkPrixodDoc({ product_id: id }));
    }

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }

  static async templateImport(req, res) {
    const { fileName, fileRes } = await HelperFunctions.returnTemplateFile('prixod.xlsx', req.i18n);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    return res.send(fileRes);
  }

  static async readFile(req, res) {
    const filePath = req.file.path;

    const { result: data, header } = await HelperFunctions.readFile(filePath);

    for (let item of data) {
      const { error } = PrixodJur7Schema.import(req.i18n).validate(item);
      if (error) {
        return res.error(error.details[0].message, 400, { code: CODE.EXCEL_IMPORT.code, doc: item, header });
      }
    }

    for (let item of data) {
      item.iznos = item.iznos === 'ha' ? true : false;

      item.nds_summa = item.nds_foiz ? (item.nds_foiz / 100) * item.summa : 0;

      item.summa_s_nds = item.summa + item.nds_summa;

      item.group = await GroupService.getById({ id: item.group_jur7_id });

      item.iznos = item.group.iznos_foiz > 0 ? true : false;
      item.iznos_schet = item.group.schet;
      item.iznos_sub_schet = item.group.provodka_subschet;

      if (!item.iznos && item.eski_iznos_summa) {
        return res.error(req.i18n.t('IznosSummaError'), 400, item);
      }

      item.sena = item.summa / item.kol;
    }

    return res.success(req.i18n.t('readFileSuccess'), 200, null, data);
  }

  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;
    const {
      kimdan_id,
      kimga_id,
      id_shartnomalar_organization,
      childs,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id
    } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const organization = await OrganizationService.getById({ region_id, id: kimdan_id });
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    const responsible = await ResponsibleService.getById({ region_id, id: kimga_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound'), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({ region_id, id: id_shartnomalar_organization });
      if (!contract) {
        return res.error(req.i18n.t('contractNotFound'), 404);
      }

      if (shartnoma_grafik_id) {
        const grafik = contract.grafiks.find(item => item.id === shartnoma_grafik_id);
        if (!grafik) {
          return res.error(req.i18n.t('grafikNotFound'), 404);
        }
      }
    }

    if (organization_by_raschet_schet_id) {
      const account_number = await AccountNumberService.getById({ organ_id: kimdan_id, id: organization_by_raschet_schet_id });
      if (!account_number) {
        return res.error(req.i18n.t('account_number_not_found'), 404);
      }
    }

    if (organization_by_raschet_schet_gazna_id) {
      const gazna = await GaznaService.getById({ organ_id: kimdan_id, id: organization_by_raschet_schet_gazna_id });
      if (!gazna) {
        return res.error(req.i18n.t('gazna_not_found'), 404);
      }
    }

    for (let child of childs) {
      child.group = await GroupService.getById({ id: child.group_jur7_id });
      if (!child.group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      if ((!child.iznos && child.eski_iznos_summa) || (child.iznos && !child.group.iznos_foiz)) {
        return res.error(req.i18n.t('IznosSummaError'), 400, child);
      }

      child.old_iznos = child.eski_iznos_summa / child.kol;
    }

    const result = await PrixodJur7Service.create({ ...req.body, user_id, main_schet_id, budjet_id, childs, region_id });

    return res.success(req.i18n.t('createSuccess'), 200, result.dates, result.doc);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const offset = (page - 1) * limit;

    const { data, total } = await PrixodJur7Service.get({ search, region_id, from, to, main_schet_id, offset, limit })

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    };

    return res.success(req.i18n.t('getSuccess'), 200, meta, data || [])
  }

  static async getById(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await PrixodJur7Service.getById({ region_id, id, main_schet_id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;
    const {
      kimdan_id,
      kimga_id,
      id_shartnomalar_organization,
      childs,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id
    } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const oldData = await PrixodJur7Service.getById({ region_id, id, main_schet_id, isdeleted: true });
    if (!oldData) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const productIds = await PrixodJur7Service.getProductIds({ id });

    for (let id of productIds) {
      const check = await PrixodJur7Service.checkPrixodDoc({ product_id: id });
      if (check.length) {
        return res.error(req.i18n.t('rasxodProductError'), 409, { code: CODE.DOCS_HAVE.code, docs: check });
      }
    }

    const responsible = await ResponsibleService.getById({ region_id, id: kimga_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound'), 404);
    }

    const organization = await OrganizationService.getById({ region_id, id: kimdan_id });
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({ region_id, id: id_shartnomalar_organization });
      if (!contract) {
        return res.error(req.i18n.t('contractNotFound'), 404);
      }

      if (shartnoma_grafik_id) {
        const grafik = contract.grafiks.find(item => item.id === shartnoma_grafik_id);
        if (!grafik) {
          return res.error(req.i18n.t('grafikNotFound'), 404);
        }
      }
    }

    if (organization_by_raschet_schet_id) {
      const account_number = await AccountNumberService.getById({ organ_id: kimdan_id, id: organization_by_raschet_schet_id });
      if (!account_number) {
        return res.error(req.i18n.t('account_number_not_found'), 404);
      }
    }

    if (organization_by_raschet_schet_gazna_id) {
      const gazna = await GaznaService.getById({ organ_id: kimdan_id, id: organization_by_raschet_schet_gazna_id });
      if (!gazna) {
        return res.error(req.i18n.t('gazna_not_found'), 404);
      }
    }

    for (let child of childs) {
      child.group = await GroupService.getById({ id: child.group_jur7_id });
      if (!child.group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      if ((!child.iznos && child.eski_iznos_summa) || (child.iznos && !child.group.iznos_foiz)) {
        return res.error(req.i18n.t('IznosSummaError'), 400, child);
      }

      child.old_iznos = child.eski_iznos_summa / child.kol;
    }

    const result = await PrixodJur7Service.update({ ...req.body, budjet_id, main_schet_id, user_id, id, childs, oldData, region_id });

    return res.success(req.i18n.t('updateSuccess'), 200, result.dates, result.doc);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const oldData = await PrixodJur7Service.getById({ region_id, id, main_schet_id });
    if (!oldData) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const productIds = await PrixodJur7Service.getProductIds({ id });

    for (let id of productIds) {
      const check = await PrixodJur7Service.checkPrixodDoc({ product_id: id });
      if (check.length) {
        return res.error(req.i18n.t('rasxodProductError'), 409, { code: CODE.DOCS_HAVE.code, docs: check });
      }
    }

    const result = await PrixodJur7Service.deleteDoc({ id, region_id, oldData });

    return res.success(req.i18n.t('deleteSuccess'), 200, result.dates, result.doc);
  }

  static async getPrixodReport(req, res) {
    const region_id = req.user.region_id;
    const { from, to, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const { fileName, filePath } = await PrixodJur7Service.prixodReport({ main_schet_id, region_id, from, to });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    return res.sendFile(filePath);
  }
}