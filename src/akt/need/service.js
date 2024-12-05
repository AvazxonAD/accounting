const { MainSchetDB } = require('../../spravochnik/main.schet/db')
const { OperatsiiDB } = require('../../spravochnik/operatsii/db')
const { OrganizationDB } = require('../../spravochnik/organization/db')
const { ContractDB } = require('../../shartnoma/shartnoma/db')
const { checkSchetsEquality, childsSumma, tashkentTime } = require('../../helper/functions')
const { PodrazdelenieDB } = require('../../spravochnik/podrazdelenie/db')
const { SostavDB } = require('../../spravochnik/sostav/db')
const { TypeOperatsiiDB } = require('../../spravochnik/type.operatsii/db')
const { AktDB } = require('./db')
const { db } = require('../../db/index')

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
        const operatsii = await OperatsiiDB([spravochnik_operatsii_own_id, "general"]);
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
            const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id, "Akt_priyom_peresdach"]);
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
        const operatsiis = await OperatsiiDB.getOperatsiiByChildArray([childs, 'Akt_priyom_peresdach'])
        if (!checkSchetsEquality(operatsiis)) {
            throw new ErrorResponse('Multiple different schet values were selected. Please ensure only one type of schet is returned', 400)
        }
        const summa = childsSumma(childs);
        const result = await db.transaction(async (client) => {
            const doc = await AktDB.createAkt([
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
            childs = childs.map(item => {
                item.created_at = tashkentTime()
                item.updated_at = tashkentTime()
                item.main_schet_id = main_schet_id
                item.user_id = user_id
            })
            const items = await AktDB.createAktChild(childs, client)
            doc.childs = items;
            return doc;
        })
        return res.status(201).json({
            message: "akt created successfully",
            data: result
        })
    }
};