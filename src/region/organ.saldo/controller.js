const { checkSchetsEquality } = require('@helper/functions');
const { MainSchetService } = require('@main_schet/service');
const { PodotchetService } = require('@podotchet/service');
const { OperatsiiService } = require('@operatsii/service')
const { PodrazdelenieService } = require('@podraz/service')
const { SostavService } = require('@sostav/service')
const { TypeOperatsiiService } = require('@type_operatsii/service');
const { OrganSaldoService } = require('./service');
const { OrganizationService } = require('@organization/service');
const { ContractService } = require('@contract/service');
const { GaznaService } = require('@gazna/service');
const { AccountNumberService } = require('@account_number/service');

exports.Controller = class {
    static async create(req, res) {
        const main_schet_id = req.query.main_schet_id;
        const user_id = req.user.id;
        const region_id = req.user.region_id;

        const {
            childs,
            organ_id,
            contract_id,
            organ_account_number_id,
            organ_gazna_number_id,
            contract_grafik_id,
            prixod,
            rasxod
        } = req.body;

        if (prixod && rasxod) {
            return res.error(req.i18n.t('validationError'), 400);
        }

        const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error(req.i18n.t('mainSchetNotFound'), 400)
        }

        const organization = await OrganizationService.getById({ region_id, id: organ_id });
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        if (!contract_id && contract_grafik_id) {
            return res.error(req.i18n.t('contractNotFound'), 404);
        }

        if (contract_id) {
            const contract = await ContractService.getById({ region_id, id: contract_id, organ_id });
            if (!contract) {
                return res.error(req.i18n.t('contractNotFound'), 404);
            }

            if (contract_grafik_id) {
                const grafik = contract.grafiks.find(item => item.id === contract_grafik_id);
                if (!grafik) {
                    return res.error(req.i18n.t('grafikNotFound'), 404);
                }
            }
        }

        if (organ_account_number_id) {
            const account_number = await AccountNumberService.getById({ organ_id: organ_id, id: organ_account_number_id });
            if (!account_number) {
                return res.error(req.i18n.t('account_number_not_found'), 404);
            }
        }

        if (organ_gazna_number_id) {
            const gazna = await GaznaService.getById({ organ_id: organ_id, id: organ_gazna_number_id });
            if (!gazna) {
                return res.error(req.i18n.t('gazna_not_found'), 404);
            }
        }

        const operatsiis = [];
        for (let child of childs) {
            const operatsii = await OperatsiiService.getById({ type: "general", id: child.operatsii_id });
            if (!operatsii) {
                return res.error(req.i18n.t('operatsiiNotFound'), 404)
            }

            operatsiis.push(operatsii);

            if (child.podraz_id) {
                const podraz = await PodrazdelenieService.getById({ region_id, id: child.podraz_id })
                if (!podraz) {
                    return res.error(req.i18n.t('podrazNotFound'), 404);
                }
            }

            if (child.sostav_id) {
                const sostav = await SostavService.getById({ region_id, id: child.sostav_id });
                if (!sostav) {
                    return res.error(req.i18n.t('sostavNotFound'), 404);
                }
            }

            if (child.type_operatsii_id) {
                const operatsii = await TypeOperatsiiService.getById({ id: child.type_operatsii_id, region_id });
                if (!operatsii) {
                    return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
                }
            }
        }

        if (!checkSchetsEquality(operatsiis)) {
            res.error(req.i18n.t('schetDifferentError'), 400)
        }

        const result = await OrganSaldoService.create({ ...req.body, main_schet_id, user_id })

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

        const { data, total_count, summa, page_summa } = await OrganSaldoService.get({ search, region_id, main_schet_id, from, to, offset, limit });

        const pageCount = Math.ceil(total_count / limit);

        const meta = {
            pageCount: pageCount,
            count: total_count,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa,
            page_summa
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

        const result = await OrganSaldoService.getById({ region_id, main_schet_id, id, isdeleted: true });
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

        const {
            childs,
            organ_id,
            contract_id,
            organ_account_number_id,
            organ_gazna_number_id,
            contract_grafik_id,
            prixod,
            rasxod
        } = req.body;

        const old_data = await OrganSaldoService.getById({ region_id, main_schet_id, id, isdeleted: true });
        if (!old_data) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }

        if (prixod && rasxod) {
            return res.error(req.i18n.t('validationError'), 400);
        }

        const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error(req.i18n.t('mainSchetNotFound'), 400)
        }

        const organization = await OrganizationService.getById({ region_id, id: organ_id });
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        if (!contract_id && contract_grafik_id) {
            return res.error(req.i18n.t('contractNotFound'), 404);
        }

        if (contract_id) {
            const contract = await ContractService.getById({ region_id, id: contract_id, organ_id });
            if (!contract) {
                return res.error(req.i18n.t('contractNotFound'), 404);
            }

            if (contract_grafik_id) {
                const grafik = contract.grafiks.find(item => item.id === contract_grafik_id);
                if (!grafik) {
                    return res.error(req.i18n.t('grafikNotFound'), 404);
                }
            }
        }

        if (organ_account_number_id) {
            const account_number = await AccountNumberService.getById({ organ_id: organ_id, id: organ_account_number_id });
            if (!account_number) {
                return res.error(req.i18n.t('account_number_not_found'), 404);
            }
        }

        if (organ_gazna_number_id) {
            const gazna = await GaznaService.getById({ organ_id: organ_id, id: organ_gazna_number_id });
            if (!gazna) {
                return res.error(req.i18n.t('gazna_not_found'), 404);
            }
        }

        const operatsiis = [];
        for (let child of childs) {
            const operatsii = await OperatsiiService.getById({ type: "general", id: child.operatsii_id });
            if (!operatsii) {
                return res.error(req.i18n.t('operatsiiNotFound'), 404)
            }

            operatsiis.push(operatsii);

            if (child.podraz_id) {
                const podraz = await PodrazdelenieService.getById({ region_id, id: child.podraz_id })
                if (!podraz) {
                    return res.error(req.i18n.t('podrazNotFound'), 404);
                }
            }

            if (child.sostav_id) {
                const sostav = await SostavService.getById({ region_id, id: child.sostav_id });
                if (!sostav) {
                    return res.error(req.i18n.t('sostavNotFound'), 404);
                }
            }

            if (child.type_operatsii_id) {
                const operatsii = await TypeOperatsiiService.getById({ id: child.type_operatsii_id, region_id });
                if (!operatsii) {
                    return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
                }
            }
        }

        if (!checkSchetsEquality(operatsiis)) {
            res.error(req.i18n.t('schetDifferentError'), 400)
        }

        const result = await OrganSaldoService.update({ ...req.body, main_schet_id, user_id, id, old_data });

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

        const doc = await OrganSaldoService.getById({ region_id, main_schet_id, id });
        if (!doc) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }

        const result = await OrganSaldoService.delete({ id });

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }
};