const { SaldoService } = require('./service');
const { ResponsibleService } = require('@responsible/service');
const { BudjetService } = require('@budjet/service');
const { MainSchetService } = require('@main_schet/service');
const { GroupService } = require('@group/service');
const { SaldoSchema } = require('./schema');
const { HelperFunctions } = require('../../../helper/functions');

exports.Controller = class {
  static async updateIznosSumma(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;

    const { iznos_summa } = req.body;

    const check = await SaldoService.getById({ id, region_id, iznos: true });
    if (!check) {
      return res.error(req.i18n.t('saldoNotFound'), 404);
    }

    const response = await SaldoService.updateIznosSumma({ id, iznos_summa });

    return res.success(req.i18n.t('updateSuccess'), 200, null, response);
  }

  static async templateFile(req, res) {

    const { fileName, fileRes } = await HelperFunctions.returnTemplateFile('saldo.xlsx');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    return res.send(fileRes);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, to, type, search, page, limit, group_id, iznos } = req.query;
    const data = { responsibles: [], groups: [], products: [], total: 0 };

    const offset = (page - 1) * limit;

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({ region_id, id: kimning_buynida });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }
    }

    // product
    if (type === 'product') {
      const _data = await SaldoService.getByProduct({ ...req.query, region_id, responsible_id: kimning_buynida, offset });
      data.products = _data.data;
      data.total = _data.total;
    }

    // group
    else if (type === 'group') {
      let { data: groups, total } = await GroupService.get({ offset, limit });

      if (group_id) {
        groups = groups.filter(item => item.id === group_id);
        total = 1;
      }

      data.groups = await SaldoService.getByGroup({ ...req.query, region_id, groups, offset })
      data.total = total;
    }

    // responsible
    else {
      let { data: responsibles, total } = await ResponsibleService.get({ ...req.query, region_id, offset, id: kimning_buynida });

      if (kimning_buynida) {
        responsibles = responsibles.filter(item => item.id === kimning_buynida);
        total = 1;
      }

      data.responsibles = await SaldoService.getByResponsibles({ ...req.query, region_id, responsibles, offset });
      data.total = total;
    }

    const pageCount = Math.ceil(data.total / limit);

    const meta = {
      pageCount: pageCount,
      count: data.total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }

    return res.success(req.i18n.t('getSuccess'), 200, meta, data);
  }

  static async import(req, res) {
    if (!req.file) {
      return res.error(req.i18n.t('fileError'), 400);
    }

    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id, budjet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await SaldoService.readFile({ filePath: req.file.path });
    const { error, value } = SaldoSchema.importData(req.i18n).validate(data);
    if (error) {
      return res.error(error.details[0].message, 400);
    }

    const date_saldo = HelperFunctions.checkYearMonth(value);
    if (!date_saldo) {
      return res.error(req.i18n.t('differentSaldoDate'), 400);
    }

    for (let doc of value) {
      const responsible = await ResponsibleService.getById({ region_id, id: doc.responsible_id });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }

      const group = await GroupService.getById({ id: doc.group_jur7_id });
      if (!group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      doc.date_saldo = new Date(`${doc.year}-${doc.month}-01`);

      if (doc.doc_date) {
        const dates = doc.doc_date.split('.');
        doc.doc_date = new Date(`${dates[2]}-${dates[1]}-${dates[0]}`);
      } else {
        doc.doc_date = new Date();
      }

      doc.doc_num = doc.doc_num ? doc.doc_num : 'saldo';

      doc.iznos = group.iznos_foiz > 0 ? true : false
      doc.iznos_foiz = group.iznos_foiz;
      doc.iznos_schet = group.schet;
      doc.iznos_sub_schet = group.provodka_subschet;

      if (!doc.iznos && doc.eski_iznos_summa > 0) {
        return res.error(`${req.i18n.t('iznosSummaError')}`, 400, doc);
      }
    }

    await SaldoService.importData({ docs: value, main_schet_id, budjet_id, user_id, region_id, date_saldo });

    return res.success(req.i18n.t('importSuccess'), 201);
  }

  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const { last_saldo, last_date } = await SaldoService.lastSaldo({ region_id, ...req.body });
    if (last_saldo.data.length === 0) {
      return res.error(req.i18n.t('lastSaldoNotFound'), 404);
    }

    await SaldoService.create({ region_id, user_id, ...req.body, last_saldo: last_saldo.data, last_date, budjet_id });

    return res.success(req.i18n.t('createSuccess'), 200);
  }

  static async check(req, res) {
    const region_id = req.user.region_id;

    const { meta, result: response } = await SaldoService.check({ region_id, ...req.query });

    return res.success(req.i18n.t('getSuccess'), 200, meta, response);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;

    const response = await SaldoService.getById({ region_id, id, isdeleted: true });

    return res.success(req.i18n.t('getSuccess'), 200, null, response);
  }
}