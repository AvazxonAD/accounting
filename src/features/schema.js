const Joi = require('joi');

exports.getDocNumSchema = Joi.object({
    params: Joi.object({
        pageName: Joi.string().trim().pattern('^[a-zA-Z_]+$')
    })
})