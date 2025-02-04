const { MainSchetDB } = require('../spravochnik/main.schet/db')
const { OperatsiiDB } = require('../spravochnik/operatsii/db')
const { OrganizationDB } = require('../spravochnik/organization/db')
const { ContractDB } = require('../shartnoma/db')
const { checkSchetsEquality, tashkentTime } = require('../helper/functions')
const { PodrazdelenieDB } = require('../spravochnik/podrazdelenie/db')
const { SostavDB } = require('../spravochnik/sostav/db')
const { TypeOperatsiiDB } = require('../spravochnik/type.operatsii/db')
const { ShowServiceDB } = require('./db')
const { db } = require('../db/index')

exports.ShowServiceService = class {
    static async createShowService(req, res) {
        const {
            doc_num,
            doc_date,
            opisanie,
            id_spravochnik_organization,
            shartnomalar_organization_id,
            spravochnik_operatsii_own_id,
            childs
        } = req.body;
        const region_id = req.user.region_id;
        const user_id = req.user.id;
        const main_schet_id = req.query.main_schet_id;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const operatsii = await OperatsiiDB.getByIdOperatsii([spravochnik_operatsii_own_id], "general");
        if (!operatsii) {
            return res.status(404).json({
                message: "operatsii not found"
            })
        }
        const organization = await OrganizationDB.getById([region_id, id_spravochnik_organization]);
        if (!organization) {
            return res.status(404).json({
                message: "organization not found"
            })
        }
        if (shartnomalar_organization_id) {
            const shartnoma = await ContractDB.getByIdContract(
                [region_id, shartnomalar_organization_id],
                false, main_schet.spravochnik_budjet_name_id,
                id_spravochnik_organization
            );
            if (!shartnoma || shartnoma.pudratchi_bool) {
                return res.status(404).json({
                    message: "conrtact not found"
                })
            }
        }
        for (let child of childs) {
            const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id], "show_service");
            if (!operatsii) {
                return res.error(req.i18n.t('operatsiiNotFound'), 404);
            }
            if (child.id_spravochnik_podrazdelenie) {
                const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, child.id_spravochnik_podrazdelenie]);
                if (!podrazdelenie) {
                    return res.error(req.i18n.t('podrazNotFound'), 404);
                }
            }
            if (child.id_spravochnik_sostav) {
                const sostav = await SostavDB.getByIdSostav([region_id, child.id_spravochnik_sostav]);
                if (!sostav) {
                    return res.eror(req.i18n.t('sostavNotFound'), 404);
                }
            }
            if (child.id_spravochnik_type_operatsii) {
                const type_operatsii = await TypeOperatsiiDB.getByIdTypeOperatsii([region_id, child.id_spravochnik_type_operatsii]);
                if (!type_operatsii) {
                    return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
                }
            }
        }
        const operatsiis = await OperatsiiDB.getOperatsiiByChildArray(childs, 'show_service')
        if (!checkSchetsEquality(operatsiis)) {
            return res.eror(req.i18n.t('schetDifferentError'), 400);
        }
        let summa = 0;
        for (let child of childs) {
            summa += child.kol * child.sena;
        }
        let doc;
        await db.transaction(async (client) => {
            doc = await ShowServiceDB.createShowService([
                user_id,
                spravochnik_operatsii_own_id,
                doc_num,
                doc_date,
                summa,
                opisanie,
                id_spravochnik_organization,
                shartnomalar_organization_id,
                main_schet_id,
                tashkentTime(),
                tashkentTime()
            ], client);
            const result_childs = childs.map(item => {
                item.summa = item.kol * item.sena
                if (item.nds_foiz) {
                    item.nds_summa = item.nds_foiz / 100 * item.summa;
                } else {
                    item.nds_summa = 0;
                }
                item.summa_s_nds = item.summa + item.nds_summa;
                item.created_at = tashkentTime();
                item.updated_at = tashkentTime();
                item.main_schet_id = main_schet_id;
                item.user_id = user_id;
                item.spravochnik_operatsii_own_id = spravochnik_operatsii_own_id;
                item.kursatilgan_hizmatlar_jur152_id = doc.id;
                return item;
            })
            const items = await ShowServiceDB.createShowServiceChild(result_childs, client)
            doc.childs = items;
        })
        return res.status(201).json({
            message: "akt created successfully",
            data: doc
        })
    }

    static async getShowService(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, from, to, main_schet_id } =  req.query;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const offset = (page - 1) * limit;
        const { data, summa, total } = await ShowServiceDB.getShowService([region_id, from, to, main_schet_id, offset, limit]);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa,
        }
        return res.status(200).json({
            message: "show service get successfully",
            meta,
            data
        })
    }

    static async getByIdShowService(req, res) {
        const main_schet_id = req.query.main_schet_id;
        const region_id = req.user.region_id;
        const id = req.params.id;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const result = await ShowServiceDB.getByIdShowService([region_id, id, main_schet_id], true);
        if(!result){
            return res.status(404).json({
                message: "show service doc not found"
            })
        }
        return res.status(200).json({
            message: "show service doc get successfully",
            data: result
        })
    }

    static async updateShowService(req, res) {
        const {
            doc_num,
            doc_date,
            opisanie,
            id_spravochnik_organization,
            shartnomalar_organization_id,
            spravochnik_operatsii_own_id,
            childs
        } = req.body;
        const region_id = req.user.region_id;
        const user_id = req.user.id;
        const main_schet_id = req.query.main_schet_id;
        const id = req.params.id;
        const old_data = await ShowServiceDB.getByIdShowService([region_id, id, main_schet_id])
        if(!old_data){
            return res.status(404).json({
                message: "show service doc not found"
            })
        }
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const operatsii = await OperatsiiDB.getByIdOperatsii([spravochnik_operatsii_own_id], "general");
        if (!operatsii) {
            return res.status(404).json({
                message: "operatsii not found"
            })
        }
        const organization = await OrganizationDB.getById([region_id, id_spravochnik_organization]);
        if (!organization) {
            return res.status(404).json({
                message: "organization not found"
            })
        }
        if (shartnomalar_organization_id) {
            const shartnoma = await ContractDB.getByIdContract(
                [region_id, shartnomalar_organization_id],
                false, main_schet.spravochnik_budjet_name_id,
                id_spravochnik_organization
            );
            if (!shartnoma || !shartnoma.pudratchi_bool) {
                return res.status(404).json({
                    message: "conrtact not found"
                })
            }
        }
        for (let child of childs) {
            const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id], "show_service");
            if (!operatsii) {
                return res.error(req.i18n.t('operatsiiNotFound'), 404);
            }
            if (child.id_spravochnik_podrazdelenie) {
                const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, child.id_spravochnik_podrazdelenie]);
                if (!podrazdelenie) {
                    return res.error(req.i18n.t('podrazNotFound'), 404);
                }
            }
            if (child.id_spravochnik_sostav) {
                const sostav = await SostavDB.getByIdSostav([region_id, child.id_spravochnik_sostav]);
                if (!sostav) {
                    return res.eror(req.i18n.t('sostavNotFound'), 404);
                }
            }
            if (child.id_spravochnik_type_operatsii) {
                const type_operatsii = await TypeOperatsiiDB.getByIdTypeOperatsii([region_id, child.id_spravochnik_type_operatsii]);
                if (!type_operatsii) {
                    return res.error(req.i18n.t('typeOperatsiiNotFound'), 404);
                }
            }
        }
        const operatsiis = await OperatsiiDB.getOperatsiiByChildArray(childs, 'show_service')
        if (!checkSchetsEquality(operatsiis)) {
            return res.eror(req.i18n.t('schetDifferentError'), 400);
        }
        let summa = 0;
        for (let child of childs) {
            summa += child.kol * child.sena;
        }
        let doc;
        await db.transaction(async (client) => {
            doc = await ShowServiceDB.updateShowService([
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_spravochnik_organization, 
                shartnomalar_organization_id, 
                spravochnik_operatsii_own_id,
                tashkentTime(),
                id
            ], client);
            await ShowServiceDB.deleteShowServiceChild([id], client)
            const result_childs = childs.map(item => {
                item.summa = item.kol * item.sena
                if (item.nds_foiz) {
                    item.nds_summa = item.nds_foiz / 100 * item.summa;
                } else {
                    item.nds_summa = 0;
                }
                item.summa_s_nds = item.summa + item.nds_summa;
                item.created_at = tashkentTime();
                item.updated_at = tashkentTime();
                item.main_schet_id = main_schet_id;
                item.user_id = user_id;
                item.spravochnik_operatsii_own_id = spravochnik_operatsii_own_id;
                item.kursatilgan_hizmatlar_jur152_id = doc.id;
                return item;
            })
            const items = await ShowServiceDB.createShowServiceChild(result_childs, client)
            doc.childs = items;
        })
        return res.status(201).json({
            message: "akt created successfully",
            data: doc
        })
    }

    static async deleteShowService(req, res) {
        const main_schet_id = req.query.main_schet_id;
        const region_id = req.user.region_id;
        const id = req.params.id;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const result = await ShowServiceDB.getByIdShowService([region_id, id, main_schet_id]);
        if(!result){
            return res.status(404).json({
                message: "show service doc not found"
            })
        }
        await db.transaction( async (client) => {
            await ShowServiceDB.deleteShowService([id], client)
        })
        return res.status(200).json({
            message: 'delete show service successfully'
        })
    }
};