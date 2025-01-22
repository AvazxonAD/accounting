const Joi = require('joi');

exports.getDocNumSchema = Joi.object({
    params: Joi.object({
        page: Joi.string().trim().pattern(/^[a-zA-Z0-9_]+$/).required()
    }),
    query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required()
    })
});
