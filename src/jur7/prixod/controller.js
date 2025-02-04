const { PrixodDB } = require('./db');
const { OrganizationDB } = require('../../spravochnik/organization/db')
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const { ContractDB } = require('../../shartnoma/db')
const { MainSchetDB } = require('../../spravochnik/main.schet/db')
const { BudjetService } = require('../../spravochnik/budjet/services');
const { PrixodJur7Service } = require('./service');
const { GroupService } = require('../spravochnik/group/service');
const { PrixodSchema } = require('./schema');
const { OrganizationService } = require('../../spravochnik/organization/service');

exports.Controller = class {
  static async templateFile(req, res) {
    const { fileName, fileRes } = await PrixodJur7Service.templateFile();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    return res.send(fileRes);
  }

  static async importData(req, res) {
    if (!req.file) {
      return res.error(req.i18n.t('fileError'), 400);
    }
    
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const filePath = req.file.path;
    const { budjet_id, main_schet_id } = req.query;


    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await PrixodJur7Service.readFile({ filePath });

    const { error, value } = PrixodSchema.importSchema().validate(data);
    if (error) {
      return res.error(req.i18n.t('validationError'), 400, { message: error.details[0].message });
    }

    const result_data = PrixodJur7Service.groupData(value);

    for (let doc of result_data) {

      // const organization = await Controller.getByInn({ region_id, inn: doc.inn, account_number: doc.account_number });
      // if (!organization) {
      //   return res.error(req.i18n.t('organizationNotFound'), 404);
      // };

      // doc.kimdan_id = organization.id;

      doc.kimdan_id = null;

      for (let child of doc.childs) {
        const group = await GroupService.getByNumberNameGroup({ number: child.group_number, name: child.group_name });
        if (!group) {
          return res.error(req.i18n.t('groupNotFound'), 404);
        }

        child.group_jur7_id = group.id;
      }
    }

    await PrixodJur7Service.importData({ data: result_data, user_id, budjet_id, main_schet_id, region_id });

    return res.success(req.i18n.t('createSuccess'), 201);
  }

  static async createPrixod(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;
    const { kimdan_id, kimga_id, id_shartnomalar_organization, childs } = req.body;

    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const organization = await OrganizationDB.getById([region_id, kimdan_id]);
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id]);
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound'), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimdan_id);
      if (!contract) {
        return res.error(req.i18n.t('contractNotFound'), 404);
      }
    }

    for (let child of childs) {
      const group = await GroupService.getByIdGroup({ id: child.group_jur7_id });
      if (!group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      if (!child.iznos && child.eski_iznos_summa > 0) {
        return res.error(`${req.i18n.t('iznosSummaError')}`, 400);
      }

      child.iznos_foiz = group.iznos_foiz;
    }

    const result = await PrixodJur7Service.createPrixod({ ...req.body, user_id, main_schet_id, budjet_id, childs });

    return res.success(req.i18n.t('createSuccess'), 200, null, result);
  }

  static async getPrixod(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id, orderType, orderBy } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const offset = (page - 1) * limit;

    const { data, total } = await PrixodJur7Service.getPrixod({ search, region_id, from, to, main_schet_id, offset, limit })

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

  static async getByIdPrixod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])

    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await PrixodJur7Service.getByIdPrixod({ region_id, id, main_schet_id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }

  static async updatePrixod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;
    const { kimdan_id, kimga_id, id_shartnomalar_organization, childs } = req.body;

    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const oldData = await PrixodDB.getByIdPrixod([region_id, id, main_schet_id])
    if (!oldData) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const productIds = await PrixodJur7Service.getProductIds({ id });

    for (let id of productIds) {
      const check = await PrixodJur7Service.checkPrixodDoc({ product_id: id });
      if (check.length) {
        return res.error(req.i18n.t('rasxodProductError'), 409, check);
      }
    }

    const organization = await OrganizationDB.getById([region_id, kimdan_id]);
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id]);
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound'), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimdan_id);
      if (!contract) {
        return res.error(req.i18n.t('contractNotFound'), 404);
      }
    }

    for (let child of childs) {
      const group = await GroupService.getByIdGroup({ id: child.group_jur7_id });
      if (!group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      if (!child.iznos && child.eski_iznos_summa > 0) {
        return res.error(req.i18n.t('iznosSummmaError'), 400);
      }

      child.iznos_foiz = group.iznos_foiz;
    }

    const result = await PrixodJur7Service.updatePrixod({ ...req.body, budjet_id, main_schet_id, user_id, id, childs });

    return res.success(req.i18n.t('updateSuccess'), 200, null, result);
  }

  static async deletePrixod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const prixod_doc = await PrixodDB.getByIdPrixod([region_id, id, main_schet_id])
    if (!prixod_doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const productIds = await PrixodJur7Service.getProductIds({ id });

    for (let id of productIds) {
      const check = await PrixodJur7Service.checkPrixodDoc({ product_id: id });
      if (check.length) {
        return res.error(req.i18n.t('rasxodProductError'), 409, check);
      }
    }

    await PrixodJur7Service.deleteDoc({ id });

    return res.success(req.i18n.t('deleteSuccess'), 200)
  }

  static async getPrixodReport(req, res) {
    const region_id = req.user.region_id;
    const { from, to, main_schet_id } = req.query;

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);;
    }

    const { fileName, filePath } = await PrixodJur7Service.prixodReport({ main_schet_id, region_id, from, to });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.sendFile(filePath);
  }
}