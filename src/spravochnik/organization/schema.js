const Joi = require('joi')

exports.createOrganizationSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required(),
        bank_klient: Joi.string().trim().required(),
        raschet_schet: Joi.string().trim().required(),
        raschet_schet_gazna: Joi.string().trim().required(),
        mfo: Joi.string().trim().required(),
        inn: Joi.string().trim().required(),
        okonx: Joi.string().trim().required(),
        parent_id: Joi.number().min(1).allow(null)
    })
}).options({ stripUnknown: true });

exports.updateOrganizationSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required(),
        bank_klient: Joi.string().trim().required(),
        raschet_schet: Joi.string().trim().required(),
        raschet_schet_gazna: Joi.string().trim().required(),
        mfo: Joi.string().trim().required(),
        inn: Joi.string().trim().required(),
        okonx: Joi.string().trim().required(),
        parent_id: Joi.number().min(1).allow(null)
    }),
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    })
}).options({ stripUnknown: true });

exports.deleteSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    })
})

exports.getByIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    })
})

exports.getOrganizationSchema = Joi.object({
    query: Joi.object({
        page: Joi.number().min(1).default(1),
        limit: Joi.number().min(1).default(10),
        search: Joi.string()
    })
}).options({ stripUnknown: true });