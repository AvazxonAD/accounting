const { SaldoService } = require('./service')
const { ResponsibleService } = require('@responsible/service');
const { ProductService } = require('@product/service');
const { BudjetService } = require('@budjet/service');
const { MainSchetService } = require('@main_schet/service');
const { GroupService } = require('@group/service');

exports.Controller = class {
  static async templateFile(req, res) {
    const { fileName, fileRes } = await SaldoService.templateFile();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    return res.send(fileRes);
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

    for (let doc of data) {
      // validate 
      const group = await GroupService.getById({ id: doc.group_jur7_id });
      if (!group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      const dates = doc.doc_date.split('.');
      doc.doc_date = `${dates[2]}-${dates[1]}-${dates[0]}`;

      doc.iznos = doc.iznos === 'ha' ? true : false;

      if (!doc.iznos && doc.eski_iznos_summa > 0) {
        return res.error(`${req.i18n.t('iznosSummaError')}`, 400);
      }

      doc.iznos_foiz = group.iznos_foiz;
    }

    await SaldoService.importData({ docs: data, main_schet_id, budjet_id, user_id });

    return res.success(req.i18n.t('importSuccess'), 201);
  }

  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;

    const { kimga_id, childs } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    for (let child of childs) {
      const responsible = await ResponsibleService.getById({ region_id, id: child.responsible_id });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }

      const group = await GroupService.getById({ id: child.group_jur7_id });
      if (!group) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      child.iznos = child.iznos === 'ha' ? true : false;

      if (!child.iznos && child.eski_iznos_summa > 0) {
        return res.error(`${req.i18n.t('iznosSummaError')}`, 400);
      }

      child.iznos_foiz = group.iznos_foiz;
    }

    const result = await SaldoService.importData({ ...req.body, user_id, main_schet_id, budjet_id, childs });

    return res.success(req.i18n.t('createSuccess'), 200, null, result);
  }

  static async getSaldo(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, to, product_id, from } = req.query;

    let { data: responsibles } = await ResponsibleService.getResponsible({ region_id, offset: 0, limit: 9999, id: kimning_buynida });
    let { data: products } = await ProductService.getNaimenovanie({ region_id, offset: 0, limit: 9999, id: product_id });

    if (product_id) {
      const product = await ProductService.getById({ region_id, id: product_id })
      if (!product) {
        return res.error(req.i18n.t('productNotFound'));
      }
      products = products.filter(item => item.id === product_id);
    }

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({ region_id, id: kimning_buynida });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }
      responsibles = responsibles.filter(item => item.id === kimning_buynida);
    }

    const data = await SaldoService.getSaldo({ region_id, kimning_buynida, to, product_id, products, responsibles, from });

    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }
}