const { SaldoService } = require('./service');
const { ResponsibleService } = require('@responsible/service');
const { BudjetService } = require('@budjet/service');
const { MainSchetService } = require('@main_schet/service');
const { GroupService } = require('@group/service');
const { SaldoSchema } = require('./schema');
const { HelperFunctions } = require('../../../helper/functions');

exports.Controller = class {
  static async templateFile(req, res) {

    const { fileName, fileRes } = await HelperFunctions.getTemplateFile('saldo.xlsx');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    return res.send(fileRes);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, to, responsible, search } = req.query;
    const data = { responsibles: [], products: [] };

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({ region_id, id: kimning_buynida });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }
    }

    if (responsible === 'true') {
      let { data: responsibles } = await ResponsibleService.get({ region_id, offset: 0, limit: 99999, id: kimning_buynida });

      if (kimning_buynida) {
        responsibles = responsibles.filter(item => item.id === kimning_buynida);
      }

      data.responsibles = await SaldoService.getByResponsibles({ region_id, to, responsibles, search });
    }

    return res.success(req.i18n.t('getSuccess'), 200, null, data);
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

    for (let doc of value) {
      const group = await GroupService.getById({ id: doc.group_jur7_id });
      if (!group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      if (doc.doc_date) {
        const dates = doc.doc_date.split('.');
        doc.doc_date = `${dates[2]}-${dates[1]}-${dates[0]}`;
      } else {
        doc.doc_date = new Date();
      }

      doc.iznos = doc.iznos === 'ha' ? true : false;

      if (!doc.iznos && doc.eski_iznos_summa > 0) {
        return res.error(`${req.i18n.t('iznosSummaError')}`, 400);
      }

      doc.iznos_foiz = group.iznos_foiz;
    }

    await SaldoService.importData({ docs: value, main_schet_id, budjet_id, user_id, region_id });

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

    await SaldoService.create({ region_id, user_id, ...req.body });

    return res.success(req.i18n.t('createSuccess'), 200);
  }

  static async check(req, res) {
    const region_id = req.user.region_id;

    const response = await SaldoService.check({ region_id, ...req.query });

    return res.success(req.i18n.t('getSuccess'), 200, null, response);
  }


}