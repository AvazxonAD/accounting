const Joi = require('joi');

exports.loginSchema = Joi.object({
    body: Joi.object({
        login: Joi.string().trim().required(),
        password: Joi.string().trim().required()
    })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
    body: Joi.object({
        fio: Joi.string().trim().required().trim(),
        login: Joi.string().trim().required().trim(),
        oldPassword: Joi.string().trim().required(),
        newPassword: Joi.string().trim().required()
    })
}).options({ stripUnknown: true });