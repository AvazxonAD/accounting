const { ProductService } = require('@product/service')
const { ResponsibleService } = require('@responsible/service')
const { IznosService } = require('./service');
const { BudjetService } = require('@budjet/service');


exports.Controller = class {
    static async get(req, res) {
        const region_id = req.user.region_id;
        const { product_id, responsible_id, search, year, month, page, limit } = req.query;
        const offset = (page - 1) * limit;
        if (product_id) {
            const product = await ProductService.getById({ region_id, id: child.naimenovanie_tovarov_jur7_id });
            if (!product) {
                return res.error(req.i18n.t('productNotFound'), 404);
            }
        }

        if (responsible_id) {
            const responsible = await ResponsibleService.getById({ region_id, id: responsible_id });
            if (!responsible) {
                return res.error(req.i18n.t('responsibleNotFound'), 404);
            }
        }

        const { data, total_count } = await IznosService.get({ region_id, offset, limit, responsible_id, product_id, year, month, search });

        const pageCount = Math.ceil(total_count / limit);
        const meta = {
            pageCount: pageCount,
            count: total_count,
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

    static async getByIdIznos(req, res) {
        const id = req.params.id;

        const iznos = await IznosService.getByIdIznos({ id });
        if (!iznos) {
            return res.error('Iznos not found', 404);
        }

        return res.success(req.i18n.t('updateSuccess'), 200, null, iznos);
    }

    static async create(req, res) {
        const { budjet_id } = req.query;
        const { products, year, month, } = req.body;
        const region_id = req.user.region_id;
        const user_id = req.user.id;

        const budjet = await BudjetService.getById({ id: budjet_id });
        if (!budjet) {
            return res.error(req.i18n.t('budjetNotFound'), 404);
        }

        for (let product of products) {
            const is_null = await ProductService.getById({ region_id, id: product.id });
            if (!is_null) {
                return res.error(req.i18n.t('productNotFound'), 404);
            }

            const check = await IznosService.getByProductId({ product_id: product.id, year, month });
            if (check) {
                return res.error(req.i18n.t('IznosAlreadyExist'), 400, product);
            }
        }

        await IznosService.create({ products, user_id, month, year, budjet_id });

        return res.success(req.i18n.t('createSuccess'), 404);
    }
}