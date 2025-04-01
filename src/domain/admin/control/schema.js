const Joi = require('joi')

exports.controlSchema = Joi.object({
    query: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required()
    })
}).options({ stripUnknown: true });
