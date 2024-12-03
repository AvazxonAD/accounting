const Joi = require('joi')

exports.createSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required()
    })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required()
    }),
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    })
}).options({ stripUnknown: true });

exports.deleteSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    })
}).options({ stripUnknown: true });
