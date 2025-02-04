const { checkSchetsEquality } = require('../../helper/functions');
const { MainSchetService } = require('../../spravochnik/main.schet/services');
const { PodotchetService } = require('../../spravochnik/podotchet/service');
const { OperatsiiService } = require('../../spravochnik/operatsii/service')
const { PodrazdelenieService } = require('../../spravochnik/podrazdelenie/service')
const { SostavService } = require('../../spravochnik/sostav/service')
const { TypeOperatsiiService } = require('../../spravochnik/type.operatsii/service');
const { BankRasxodService } = require('./service');
const { OrganizationService } = require('../../spravochnik/organization/services');

exports.Controller = class {
  static async fio(req, res) {
    const region_id = req.user.region_id
    const { main_schet_id } = req.query;

    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const result = await BankRasxodService.fio({main_schet_id, region_id});

    return res.success(req.i18n.t('getSuccess'), 200, req.query, result);
  }

  static async paymentBankRasxod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { main_schet_id } = req.query;

    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const bank_rasxod = await BankRasxodService.getByIdBankRasxod({ id, main_schet_id, region_id });
    if (!bank_rasxod) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    await BankRasxodService.paymentBankRasxod({ id, status: req.body.status });
    return res.success('Payment successfully', 200);
  }

  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { id_podotchet_litso, id_spravochnik_organization, id_shartnomalar_organization, childs } = req.body;

    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    if (id_podotchet_litso) {
      const podotchet = await PodotchetService.getByIdPodotchet({ id: id_podotchet_litso, region_id });
      if (!podotchet) {
        return res.error(req.i18n.t('podotchetNotFound'), 404);
      }
    }

    const organization = await OrganizationService.getByIdOrganization({ region_id, id: id_spravochnik_organization });
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
      const operatsii = await OperatsiiService.getByIdOperatsii({ type: "bank_rasxod", id: child.spravochnik_operatsii_id });
      if (!operatsii) {
        return res.error(req.i18n.t('operatsiiNotFound'), 404)
      }

      operatsiis.push(operatsii);

      if (child.id_spravochnik_podrazdelenie) {
        const podraz = await PodrazdelenieService.getByIdPodraz({ region_id, id: child.id_spravochnik_podrazdelenie })
        if (!podraz) {
          return res.error(req.i18n.t('podrazNotFound'), 404);
        }
      }

      if (child.id_spravochnik_sostav) {
        const sostav = await SostavService.getByIdSostav({ region_id, id: child.id_spravochnik_sostav });
        if (!sostav) {
          return res.error(req.i18n.t('sostavNotFound'), 404);
        }
      }

      if (child.id_spravochnik_type_operatsii) {
        const operatsii = await TypeOperatsiiService.getByIdTypeOperatsii({ id: child.id_spravochnik_type_operatsii, region_id });
        if (!operatsii) {
          return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
        }
      }

    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t('schetDifferentError'), 400)
    }

    const result = await BankRasxodService.create({ ...req.body, main_schet_id, user_id })

    return res.success(req.i18n.t('createSucccess'), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id
    const { page, limit, from, to, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const offset = (page - 1) * limit;

    const { data, total_count, summa } = await BankRasxodService.get({ region_id, main_schet_id, from, to, offset, limit });

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

    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const result = await BankRasxodService.getById({ region_id, main_schet_id, id, isdeleted: true });
    if (!result) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }

  static async update(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { id_podotchet_litso, id_spravochnik_organization, id_shartnomalar_organization, childs } = req.body;

    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const doc = await BankRasxodService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    if (id_podotchet_litso) {
      const podotchet = await PodotchetService.getByIdPodotchet({ id: id_podotchet_litso, region_id });
      if (!podotchet) {
        return res.error(req.i18n.t('podotchetNotFound'), 404);
      }
    }

    const organization = await OrganizationService.getByIdOrganization({ region_id, id: id_spravochnik_organization });
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
      const operatsii = await OperatsiiService.getByIdOperatsii({ type: "bank_rasxod", id: child.spravochnik_operatsii_id });
      if (!operatsii) {
        return res.error(req.i18n.t('operatsiiNotFound'), 404)
      }

      operatsiis.push(operatsii);

      if (child.id_spravochnik_podrazdelenie) {
        const podraz = await PodrazdelenieService.getByIdPodraz({ region_id, id: child.id_spravochnik_podrazdelenie })
        if (!podraz) {
          return res.error(req.i18n.t('podrazNotFound'), 404);
        }
      }

      if (child.id_spravochnik_sostav) {
        const sostav = await SostavService.getByIdSostav({ region_id, id: child.id_spravochnik_sostav });
        if (!sostav) {
          return res.error(req.i18n.t('sostavNotFound'), 404);
        }
      }

      if (child.id_spravochnik_type_operatsii) {
        const operatsii = await TypeOperatsiiService.getByIdTypeOperatsii({ id: child.id_spravochnik_type_operatsii, region_id });
        if (!operatsii) {
          return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
        }
      }

    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t('schetDifferentError'), 400)
    }

    const result = await BankRasxodService.update({ ...req.body, main_schet_id, user_id, id });

    return res.success(req.i18n.t('updateSuccess'), 200, null, result);
  }

  static async delete(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const doc = await BankRasxodService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const result = await BankRasxodService.delete({ id });

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }
};