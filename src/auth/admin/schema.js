const Joi = require('joi');

exports.createSchema = Joi.object({
    body: Joi.object({
        login: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
        fio: Joi.string().trim().required(),
        region_id: Joi.number().integer().min(1).required()
    })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
    body: Joi.object({
        login: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
        fio: Joi.string().trim().required(),
        region_id: Joi.number().integer().min(1).required()
    }),
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });

exports.deleteSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });
