
const Joi = require('joi')

exports.createSchema = Joi.object({
    body: Joi.object({
        spravochnik_operatsii_own_id: Joi.number().required().min(1).integer(),
        doc_num: Joi.string().trim(),
        doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        opisanie: Joi.string().trim(),
        id_spravochnik_organization: Joi.number().required().min(1).integer(),
        shartnomalar_organization_id: Joi.number().allow(null).min(1).integer(),
        organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
        shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
        childs: Joi.array().items(
            Joi.object({
                kol: Joi.number().min(1).required(),
                sena: Joi.number().min(1).required(),
                nds_foiz: Joi.number().min(1).allow(0).max(99).default(0),
                spravochnik_operatsii_id: Joi.number().required().min(1).integer(),
                id_spravochnik_podrazdelenie: Joi.number().min(1).integer().allow(null),
                id_spravochnik_sostav: Joi.number().min(1).integer().allow(null),
                id_spravochnik_type_operatsii: Joi.number().min(1).integer().allow(null)
            })
        ).min(1).required()
    }),
    query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
    body: Joi.object({
        spravochnik_operatsii_own_id: Joi.number().required().min(1).integer(),
        doc_num: Joi.string().trim(),
        doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        opisanie: Joi.string().trim(),
        id_spravochnik_organization: Joi.number().required().min(1).integer(),
        shartnomalar_organization_id: Joi.number().allow(null).min(1).integer(),
        organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
        shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
        childs: Joi.array().items(
            Joi.object({
                kol: Joi.number().min(1).required(),
                sena: Joi.number().min(1).required(),
                nds_foiz: Joi.number().min(1).allow(0).max(99).default(0),
                spravochnik_operatsii_id: Joi.number().required().min(1).integer(),
                id_spravochnik_podrazdelenie: Joi.number().min(1).integer().allow(null),
                id_spravochnik_sostav: Joi.number().min(1).integer().allow(null),
                id_spravochnik_type_operatsii: Joi.number().min(1).integer().allow(null)
            })
        ).min(1).required()
    }),
    query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required()
    }),
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });

exports.getSchema = Joi.object({
    query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer(),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        search: Joi.string().trim().allow(null, ''),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
    })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    }),
    query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });

exports.deleteSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    }),
    query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });