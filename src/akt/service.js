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

exports.AktService = class {
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
        const organization = await OrganizationDB.getByIdorganization([region_id, id_spravochnik_organization]);
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
            const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id], "akt");
            if (!operatsii) {
                return res.status(404).json({
                    message: 'operatsii not found'
                })
            }
            if (child.id_spravochnik_podrazdelenie) {
                const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, child.id_spravochnik_podrazdelenie]);
                if (!podrazdelenie) {
                    return res.status(404).json({
                        message: "podrazdelenie not found"
                    })
                }
            }
            if (child.id_spravochnik_sostav) {
                const sostav = await SostavDB.getByIdSostav([region_id, child.id_spravochnik_sostav]);
                if (!sostav) {
                    return res.status(404).json({
                        message: "sostav not found"
                    })
                }
            }
            if (child.id_spravochnik_type_operatsii) {
                const type_operatsii = await TypeOperatsiiDB.getByIdTypeOperatsii([region_id, child.id_spravochnik_type_operatsii]);
                if (!type_operatsii) {
                    return res.status(404).json({
                        message: "type_operatsii not found"
                    })
                }
            }
        }
        const operatsiis = await OperatsiiDB.getOperatsiiByChildArray(childs, 'akt')
        if (!checkSchetsEquality(operatsiis)) {
            throw new ErrorResponse('Multiple different schet values were selected. Please ensure only one type of schet is returned', 400)
        }
        let summa = 0;
        for (let child of childs) {
            summa += child.kol * child.sena;
        }
        let doc;
        await db.transaction(async (client) => {
            doc = await AktDB.createAkt([
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_spravochnik_organization, 
                shartnomalar_organization_id, 
                main_schet_id,
                user_id,
                spravochnik_operatsii_own_id,
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
                item.bajarilgan_ishlar_jur3_id = doc.id;
                return item;
            })
            const items = await AktDB.createAktChild(result_childs, client)
            doc.childs = items;
        })
        return res.status(201).json({
            message: "akt created successfully",
            data: doc
        })
    }

    static async getAkt(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, from, to, main_schet_id } =  req.query;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const offset = (page - 1) * limit;
        const data = await AktDB.getAkt([region_id, main_schet_id, from, to, offset, limit]);
        const total = await AktDB.getTotalAkt([region_id, main_schet_id, from, to])
        let summa;
        data.forEach(item => {
            summa += item.summa;
        })
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
            message: "akt get successfully",
            meta,
            data
        })
    }

    static async getByIdAkt(req, res) {
        const main_schet_id = req.query.main_schet_id;
        const region_id = req.user.region_id;
        const id = req.params.id;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const result = await AktDB.getByIdAkt([region_id, main_schet_id, id ], true);
        if(!result){
            return res.status(404).json({
                message: "akt doc not found"
            })
        }
        return res.status(200).json({
            message: "akt doc get successfully",
            data: result
        })
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
        if(!old_data){
            return res.status(404).json({
                message: "akt doc not found"
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
        const organization = await OrganizationDB.getByIdorganization([region_id, id_spravochnik_organization]);
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
            const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id], "akt");
            if (!operatsii) {
                return res.status(404).json({
                    message: 'operatsii not found'
                })
            }
            if (child.id_spravochnik_podrazdelenie) {
                const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, child.id_spravochnik_podrazdelenie]);
                if (!podrazdelenie) {
                    return res.status(404).json({
                        message: "podrazdelenie not found"
                    })
                }
            }
            if (child.id_spravochnik_sostav) {
                const sostav = await SostavDB.getByIdSostav([region_id, child.id_spravochnik_sostav]);
                if (!sostav) {
                    return res.status(404).json({
                        message: "sostav not found"
                    })
                }
            }
            if (child.id_spravochnik_type_operatsii) {
                const type_operatsii = await TypeOperatsiiDB.getByIdTypeOperatsii([region_id, child.id_spravochnik_type_operatsii]);
                if (!type_operatsii) {
                    return res.status(404).json({
                        message: "type_operatsii not found"
                    })
                }
            }
        }
        const operatsiis = await OperatsiiDB.getOperatsiiByChildArray(childs, 'akt')
        if (!checkSchetsEquality(operatsiis)) {
            throw new ErrorResponse('Multiple different schet values were selected. Please ensure only one type of schet is returned', 400)
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
        return res.status(201).json({
            message: "akt created successfully",
            data: doc
        })
    }

    static async deleteAkt(req, res) {
        const main_schet_id = req.query.main_schet_id;
        const region_id = req.user.region_id;
        const id = req.params.id;
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if (!main_schet) {
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        const result = await AktDB.getByIdAkt([region_id, main_schet_id, id], true);
        if(!result){
            return res.status(404).json({
                message: "akt doc not found"
            })
        }
        await db.transaction( async (client) => {
            await AktDB.deleteAkt([id], client)
        })
        return res.status(200).json({
            message: 'delete akt successfully'
        })
    }
};