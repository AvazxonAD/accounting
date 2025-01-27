const { IznosDB } = require('./db');
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db')
const { ResponsibleService } = require('../spravochnik/responsible/service')
const { IznosService } = require('./service');


exports.Controller = class {
    static async getIznos(req, res) {
        const region_id = req.user.region_id;
        const { product_id, responsible_id, search, year, month, page, limit } = req.query;
        const offset = (page - 1) * limit;
        if (product_id) {
            const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, product_id]);
            if (!product) {
                return res.error(req.i18n.t('productNotFound'));
            }
        }
        if (responsible_id) {
            const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: responsible_id });
            if (!responsible) {
                return res.error(req.i18n.t('responsibleNotFound'), 404);
            }
        }
        const { data, count } = await IznosDB.getIznos([region_id, offset, limit], responsible_id, product_id, year, month, search);

        const pageCount = Math.ceil(count / limit);
        const meta = {
            pageCount: pageCount,
            count: count,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }

        return res.success('Iznos get successfully', 200, meta, data || []);
    }

    static async updateIznos(req, res) {
        const id = req.params.id;
        const { iznos_start_date, eski_iznos_summa } = req.body;

        const iznos = await IznosService.getByIdIznos({ id });
        if (!iznos) {
            return res.error('Iznos not found', 404);
        }

        const result = await IznosService.updateIznos({ iznos_start_date, eski_iznos_summa, id });

        return res.success(req.i18n.t('updateSuccess'), 200, null, result);
    }

    static async getByIdIznos(req, res) {
        const id = req.params.id;

        const iznos = await IznosService.getByIdIznos({ id });
        if (!iznos) {
            return res.error('Iznos not found', 404);
        }

        return res.success(req.i18n.t('updateSuccess'), 200, null, iznos);
    }
}