const { SaldoService } = require('./service');
const { ResponsibleService } = require('@responsible/service');
const { BudjetService } = require('@budjet/service');
const { MainSchetService } = require('@main_schet/service');
const { GroupService } = require('@group/service');
const { SaldoSchema } = require('./schema');
const { HelperFunctions } = require('@helper/functions');
const { CODE } = require('@helper/constants');

exports.Controller = class {
  static async delete(req, res) {
    const { ids, year, month } = req.body;
    const region_id = req.user.region_id;

    for (let id of ids) {
      const check = await SaldoService.getById({ id: id.id, region_id });
      if (!check) {
        return res.error(req.i18n.t('saldoNotFound'), 404);
      }

      const check_doc = await SaldoService.checkDoc({ product_id: check.naimenovanie_tovarov_jur7_id });
      if (check_doc.length) {
        return res.error(req.i18n.t('saldoRasxodError'), 400, { code: CODE.DOCS_HAVE.code, docs: check_doc });
      }
    }

    const dates = await SaldoService.delete({ ids, region_id, year, month });

    return res.success(req.i18n.t('deleteSuccess'), 200, dates);
  }

  static async deleteById(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;

    const check = await SaldoService.getById({ id, region_id });
    if (!check) {
      return res.error(req.i18n.t('saldoNotFound'), 404);
    }

    const check_doc = await SaldoService.checkDoc({ product_id: check.naimenovanie_tovarov_jur7_id });
    if (check_doc.length) {
      return res.error(req.i18n.t('saldoRasxodError'), 400, check_doc);
    }

    const response = await SaldoService.deleteById({ id });

    return res.success(req.i18n.t('deleteSuccess'), 200, null, response);
  }

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
    const { kimning_buynida, page, limit, group_id } = req.query;

    const offset = (page - 1) * limit;

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({ region_id, id: kimning_buynida });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }
    }

    let { data: groups, total } = await GroupService.get({ offset: 0, limit: 99999 });

    if (group_id) {
      groups = groups.filter(item => item.id === group_id);
      total = 1;
    }


    groups = await SaldoService.getByGroup({ ...req.query, responsible_id: kimning_buynida, region_id, groups, offset })

    groups = groups.filter(item => item.products.length > 0);

    groups.sort((a, b) => b.products.length - a.products.length)

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }

    return res.success(req.i18n.t('getSuccess'), 200, meta, groups);
  }

  static async import(req, res) {
    if (!req.file) {
      return res.error(req.i18n.t('fileError'), 400);
    }

    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id, budjet_id } = req.query;

    const check = await SaldoService.getFirstSaldoDate({ region_id });
    if (check) {
      return res.error(req.i18n.t('saldoImportAlreadyExists'), 400);
    }

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

      if (doc.iznos_start) {
        const dates = doc.iznos_start.split('.');
        doc.iznos_start = new Date(`${dates[2]}-${dates[1]}-${dates[0]}`);
      } else {
        doc.iznos_start = new Date();
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
    let { year, month } = req.body

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }


    let last_saldo;
    let last_date;
    let attempt = 0;

    while (attempt < 1000) {
      last_date = HelperFunctions.lastDate({ year, month });

      last_saldo = await SaldoService.lastSaldo({ region_id, year: last_date.year, month: last_date.month });

      if (last_saldo.length > 0) {
        break;
      }

      year = last_date.year;
      month = last_date.month;

      attempt++;
    }

    if (!last_saldo.length) {
      await SaldoService.cleanData({ region_id });
      return res.success(req.i18n.t('celanSaldo'), 200);
    }

    const dates = await SaldoService.create({ region_id, user_id, ...req.body, last_saldo, last_date, budjet_id });

    return res.success(req.i18n.t('createSuccess'), 200, { code: dates.length ? CODE.SALDO_CREATE.code : CODE.OK.code, dates });
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