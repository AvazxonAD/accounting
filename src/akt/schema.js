const Joi = require('joi')

exports.createSchema = Joi.object({
    body: Joi.object({
        doc_num: Joi.string().trim().required(),
        doc_date: Joi.string().trim().required().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
        opisanie: Joi.string().trim(),
        spravochnik_operatsii_own_id: Joi.number().integer().min(1).required(),
        id_spravochnik_organization: Joi.number().required().integer().min(1),
        shartnomalar_organization_id: Joi.number().integer().min(1).integer().allow(null),
        childs: Joi.array().items(
            Joi.object({
                spravochnik_operatsii_id: Joi.number().required().integer().min(1),
                summa: Joi.number().required().min(1),
                id_spravochnik_podrazdelenie: Joi.number().integer().min(1).allow(null),
                id_spravochnik_sostav: Joi.number().allow(null).integer().min(1),
                id_spravochnik_type_operatsii: Joi.number().allow(null).integer().min(1),
            }),
        ),
    }),
    query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer()
    })
})

exports.updateSchema = Joi.object({
    body: Joi.object({
        doc_num: Joi.string().trim().required(),
        doc_date: Joi.string().trim().required().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
        opisanie: Joi.string().trim(),
        spravochnik_operatsii_own_id: Joi.number().integer().min(1).required(),
        id_spravochnik_organization: Joi.number().required().integer().min(1),
        shartnomalar_organization_id: Joi.number().integer().min(1).integer().allow(null),
        childs: Joi.array().items(
            Joi.object({
                spravochnik_operatsii_id: Joi.number().required().integer().min(1),
                summa: Joi.number().required().min(1),
                id_spravochnik_podrazdelenie: Joi.number().integer().min(1).allow(null),
                id_spravochnik_sostav: Joi.number().allow(null).integer().min(1),
                id_spravochnik_type_operatsii: Joi.number().allow(null).integer().min(1),
            }),
        ),
    }),
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    }),
    query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer()
    })
})

exports.getSchema = Joi.object({
    query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer(),
        limit: Joi.number().min(1).default(10).integer(),
        page: Joi.number().min(1).default(1).integer(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
    })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    })
})

exports.deleteSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    })
})