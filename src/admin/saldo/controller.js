const { SaldoService } = require('./service');
const { ResponsibleService } = require('@responsible/service');
const { RegionService } = require('@region/service');

exports.Controller = class {
  static async get(req, res) {
    const { kimning_buynida, to, responsible, search, page, limit, region_id } = req.query;
    const data = { responsibles: [], products: [] };

    const offset = (page - 1) * limit;

    if (region_id) {
      const region = await RegionService.getById({ id: region_id });
      if (!region) {
        return res.error(req.i18n.t('regionNotFound'), 404);
      }
    }

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({ region_id, id: kimning_buynida });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }
    }

    if (responsible === 'true') {
      let { data: responsibles } = await ResponsibleService.get({ region_id, offset: 0, limit: 99999 });
      if (kimning_buynida) {
        responsibles = responsibles.filter(item => item.id === kimning_buynida);
      }

      data.responsibles = await SaldoService.getByResponsibles({ region_id, to, responsibles, search, offset, limit });
    } else {
      const _data = await SaldoService.getByProduct({ region_id, to, search, offset, limit, responsible_id: kimning_buynida });
      data.products = _data.data;
      data.total = _data.total;
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
}