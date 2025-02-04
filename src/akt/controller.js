const { MainSchetDB } = require('../spravochnik/main.schet/db');
const { OperatsiiDB } = require('../spravochnik/operatsii/db');
const { OrganizationDB } = require('../spravochnik/organization/db');
const { ContractDB } = require('../shartnoma/db');
const { checkSchetsEquality, tashkentTime } = require('../helper/functions');
const { PodrazdelenieDB } = require('../spravochnik/podrazdelenie/db');
const { SostavDB } = require('../spravochnik/sostav/db');
const { TypeOperatsiiDB } = require('../spravochnik/type.operatsii/db');
const { AktDB } = require('./db');
const { db } = require('../db/index');
const { MainSchetService } = require('../spravochnik/main.schet/services');
const { AktService } = require('./service');


exports.Controller = class {
    static async createAkt(req, res) {
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
            return res.eror(req.i18n.t('mainSchetNotFound'), 404);
        }

        const operatsii = await OperatsiiDB.getByIdOperatsii([spravochnik_operatsii_own_id], "general");
        if (!operatsii) {
            return res.error(req.i18n.t('operatsiiNotFound'), 404);
        }

        const organization = await OrganizationDB.getById([region_id, id_spravochnik_organization]);
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        if (shartnomalar_organization_id) {
            const shartnoma = await ContractDB.getByIdContract(
                [region_id, shartnomalar_organization_id],
                false, main_schet.spravochnik_budjet_name_id,
                id_spravochnik_organization
            );

            if (!shartnoma || !shartnoma.pudratchi_bool) {
                return res.error(req.i18n.t('contractNotFound'), 404);
            }
        }

        const operatsiis = [];

        for (let child of childs) {
            const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id], "akt");
            if (!operatsii) {
                return res.error(req.i18n.t('operatsiiNotFound'), 404);
            }
            operatsiis.push(operatsii);

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

        if (!checkSchetsEquality(operatsiis)) {
            return res.eror(req.i18n.t('schetDifferentError'), 400);
        }

        const result = await AktService.create({ ...req.body, user_id, main_schet_id });

        return res.success(req.i18n.t('createSuccess'), 201, null, result);
    }

    static async get(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, from, to, main_schet_id } = req.query;

        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.eror(req.i18n.t('mainSchetNotFound'), 404);
        }

        const offset = (page - 1) * limit;
        const { summa, total, data, page_summa } = await AktService.get({ region_id, main_schet_id, from, to, offset, limit })

        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa,
            page_summa
        }
        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async getByIdAkt(req, res) {
        const main_schet_id = req.query.main_schet_id;
        const region_id = req.user.region_id;
        const id = req.params.id;

        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.eror(req.i18n.t('mainSchetNotFound'), 404);
        }

        const result = await AktDB.getByIdAkt([region_id, main_schet_id, id], true);
        if (!result) {
            return res.error(req.i18n.t('docNotFound'), 404);
        }
        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }

    static async updateAkt(req, res) {
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
        const old_data = await AktDB.getByIdAkt([region_id, main_schet_id, id])
        if (!old_data) {
            return res.eror(req.i18n.t('docNotFound'), 404);
        }

        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.eror(req.i18n.t('mainSchetNotFound'), 404);
        }

        const operatsii = await OperatsiiDB.getByIdOperatsii([spravochnik_operatsii_own_id], "general");
        if (!operatsii) {
            return res.error(req.i18n.t('operatsiiNotFound'), 404);
        }

        const organization = await OrganizationDB.getById([region_id, id_spravochnik_organization]);
        if (!organization) {
            return res.error(req.i18n.t('organizationNotFound'), 404);
        }

        if (shartnomalar_organization_id) {
            const shartnoma = await ContractDB.getByIdContract(
                [region_id, shartnomalar_organization_id],
                false, main_schet.spravochnik_budjet_name_id,
                id_spravochnik_organization
            );
            if (!shartnoma || !shartnoma.pudratchi_bool) {
                return res.error(req.i18n.t('contractNotFound'), 404);
            }
        }

        for (let child of childs) {
            const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id], "akt");
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
        const operatsiis = await OperatsiiDB.getOperatsiiByChildArray(childs, 'akt')
        if (!checkSchetsEquality(operatsiis)) {
            return res.eror(req.i18n.t('schetDifferentError'), 400);
        }

        let summa = 0;
        for (let child of childs) {
            summa += child.kol * child.sena;
        }

        let doc;
        await db.transaction(async (client) => {
            doc = await AktDB.updateAkt([
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
            await AktDB.deleteAktChild([id], client)
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
                item.bajarilgan_ishlar_jur3_id = doc.id;
                return item;
            })
            const items = await AktDB.createAktChild(result_childs, client)
            doc.childs = items;
        })
        return res.success(req.i18n.t('updateSuccess'), 200, null, doc);
    }

    static async deleteAkt(req, res) {
        const main_schet_id = req.query.main_schet_id;
        const region_id = req.user.region_id;
        const id = req.params.id;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.eror(req.i18n.t('mainSchetNotFound'), 404);
        }
        const result = await AktDB.getByIdAkt([region_id, main_schet_id, id], true);
        if (!result) {
            return res.error(req.i18n.t('docNotFound'), 404)
        }
        await db.transaction(async (client) => {
            await AktDB.deleteAkt([id], client)
        })
        return res.success(req.i18n.t('deleteSuccess'), 200);
    }

    static async cap(req, res) {
        const region_id = req.user.region_id;
        const { from, to, main_schet_id } = req.query

        const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error(req.i18n.t('mainSchetNotFound'), 404);
        }

        const schets = await AktDB.getSchets([region_id, main_schet_id, from, to]);


        const { fileName, filePath } = await AktService.capExcel({ ...req.query, region_id, schets });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        return res.sendFile(filePath);
    }
};