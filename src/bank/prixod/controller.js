const { checkSchetsEquality } = require('../../helper/functions');
const { MainSchetService } = require('../../spravochnik/main.schet/service');
const { PodotchetService } = require('../../spravochnik/podotchet/service');
const { OperatsiiService } = require('../../admin/spravochnik/operatsii/service')
const { PodrazdelenieService } = require('../../spravochnik/podrazdelenie/service')
const { SostavService } = require('../../spravochnik/sostav/service')
const { TypeOperatsiiService } = require('../../spravochnik/type.operatsii/service');
const { BankPrixodService } = require('./service');
const { OrganizationService } = require('../../spravochnik/organization/service');
const { ContractService } = require('../../shartnoma/contract/service');

exports.Controller = class {
  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { id_spravochnik_organization, id_shartnomalar_organization, childs } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const organization = await OrganizationService.getById({ region_id, id: id_spravochnik_organization });
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({ region_id, id: id_shartnomalar_organization });
      if (!contract) {
        return res.error(req.i18n.t('contractNotFound'), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({ type: "bank_prixod", id: child.spravochnik_operatsii_id });
      if (!operatsii) {
        return res.error(req.i18n.t('operatsiiNotFound'), 404)
      }

      operatsiis.push(operatsii);

      if (child.id_spravochnik_podrazdelenie) {
        const podraz = await PodrazdelenieService.getById({ region_id, id: child.id_spravochnik_podrazdelenie })
        if (!podraz) {
          return res.error(req.i18n.t('podrazNotFound'), 404);
        }
      }

      if (child.id_spravochnik_sostav) {
        const sostav = await SostavService.getById({ region_id, id: child.id_spravochnik_sostav });
        if (!sostav) {
          return res.error(req.i18n.t('sostavNotFound'), 404);
        }
      }

      if (child.id_spravochnik_type_operatsii) {
        const operatsii = await TypeOperatsiiService.getById({ id: child.id_spravochnik_type_operatsii, region_id });
        if (!operatsii) {
          return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
        }
      }

      if (child.id_spravochnik_podotchet_litso) {
        const podotchet = await PodotchetService.getById({ id: child.id_spravochnik_podotchet_litso, region_id });
        if (!podotchet) {
          return res.error(req.i18n.t('podotchetNotFound'), 404);
        }
      }
    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t('schetDifferentError'), 400)
    }

    const result = await BankPrixodService.create({ ...req.body, main_schet_id, user_id })

    return res.success(req.i18n.t('createSucccess'), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id
    const { page, limit, from, to, main_schet_id, search } = req.query;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const offset = (page - 1) * limit;

    const { data, total_count, summa } = await BankPrixodService.get({ search, region_id, main_schet_id, from, to, offset, limit });

    const pageCount = Math.ceil(total_count / limit);

    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa
    };

    return res.success(req.i18n.t('getSuccess'), 200, meta, data);
  }

  static async getById(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const result = await BankPrixodService.getById({ region_id, main_schet_id, id, isdeleted: true});
    if (!result) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }

  static async update(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const { id_podotchet_litso, childs, id_spravochnik_organization, id_shartnomalar_organization } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const doc = await BankPrixodService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const organization = await OrganizationService.getById({ region_id, id: id_spravochnik_organization });
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractService.getById({ region_id, id: id_shartnomalar_organization });
      if (!contract) {
        return res.error(req.i18n.t('contractNotFound'), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({ type: "bank_prixod", id: child.spravochnik_operatsii_id });
      if (!operatsii) {
        return res.error(req.i18n.t('operatsiiNotFound'), 404)
      }

      operatsiis.push(operatsii);

      if (child.id_spravochnik_podrazdelenie) {
        const podraz = await PodrazdelenieService.getById({ region_id, id: child.id_spravochnik_podrazdelenie })
        if (!podraz) {
          return res.error(req.i18n.t('podrazNotFound'), 404);
        }
      }

      if (child.id_spravochnik_sostav) {
        const sostav = await SostavService.getById({ region_id, id: child.id_spravochnik_sostav });
        if (!sostav) {
          return res.error(req.i18n.t('sostavNotFound'), 404);
        }
      }

      if (child.id_spravochnik_type_operatsii) {
        const operatsii = await TypeOperatsiiService.getById({ id: child.id_spravochnik_type_operatsii, region_id });
        if (!operatsii) {
          return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
        }
      }

      if (child.id_spravochnik_podotchet_litso) {
        const podotchet = await PodotchetService.getById({ id: child.id_spravochnik_podotchet_litso, region_id });
        if (!podotchet) {
          return res.error(req.i18n.t('podotchetNotFound'), 404);
        }
      }
    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t('schetDifferentError'), 400)
    }

    const result = await BankPrixodService.update({ ...req.body, main_schet_id, user_id, id });

    return res.success(req.i18n.t('updateSuccess'), 200, null, result);
  }

  static async delete(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const doc = await BankPrixodService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const result = await BankPrixodService.delete({ id });

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }
};