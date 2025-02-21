const { checkSchetsEquality } = require('@helper/functions');
const { MainSchetService } = require('@main_schet/service');
const { PodotchetService } = require('../../spravochnik/podotchet/service');
const { OperatsiiService } = require('@operatsii/service')
const { PodrazdelenieService } = require('../../spravochnik/podrazdelenie/service')
const { SostavService } = require('../../spravochnik/sostav/service')
const { TypeOperatsiiService } = require('../../spravochnik/type.operatsii/service');
const { KassaPrixodService } = require('./service');

exports.Controller = class {
  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { id_podotchet_litso, childs } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    if (id_podotchet_litso) {
      const podotchet = await PodotchetService.getById({ id: id_podotchet_litso, region_id });
      if (!podotchet) {
        return res.error(req.i18n.t('podotchetNotFound'), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      console.log(child.spravochnik_operatsii_id)
      const operatsii = await OperatsiiService.getById({ type: "kassa_prixod", id: child.spravochnik_operatsii_id });
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

    }

    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t('schetDifferentError'), 400)
    }

    const result = await KassaPrixodService.create({ ...req.body, main_schet_id, user_id })

    return res.success(req.i18n.t('createSucccess'), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id
    const { page, limit, main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const offset = (page - 1) * limit;

    const { data, total_count, summa, page_summa } = await KassaPrixodService.get({ ...req.query, region_id, offset });

    const pageCount = Math.ceil(total_count / limit);

    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa, page_summa
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

    const result = await KassaPrixodService.getById({ region_id, main_schet_id, id });
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
    const { id_podotchet_litso, childs } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 400)
    }

    const doc = await KassaPrixodService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    if (id_podotchet_litso) {
      const podotchet = await PodotchetService.getById({ id: id_podotchet_litso, region_id });
      if (!podotchet) {
        return res.error(req.i18n.t('podotchetNotFound'), 404);
      }
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({ type: "kassa_prixod", id: child.spravochnik_operatsii_id });
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

    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t('schetDifferentError'), 400)
    }

    const result = await KassaPrixodService.update({ ...req.body, main_schet_id, user_id, id });

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

    const doc = await KassaPrixodService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const result = await KassaPrixodService.delete({ id });

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }
};