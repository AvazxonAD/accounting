const Joi = require('joi');

exports.GrafikSchema = class {
    static create(lang) {
        return Joi.object({
            body: Joi.object({
                oy_1: Joi.number().required(),
                oy_2: Joi.number().required(),
                oy_3: Joi.number().required(),
                oy_4: Joi.number().required(),
                oy_5: Joi.number().required(),
                oy_6: Joi.number().required(),
                oy_7: Joi.number().required(),
                oy_8: Joi.number().required(),
                oy_9: Joi.number().required(),
                oy_10: Joi.number().required(),
                oy_11: Joi.number().required(),
                oy_12: Joi.number().required(),
                smeta_id: Joi.number().integer().min(1).required(),
                id_shartnomalar_organization: Joi.number().integer().min(1).required()
            }),
            query: Joi.object({
                budjet_id: Joi.number().integer().min(1).required()
            })
        }).options({ stripUnknown: true });
    }

    static update(lang) {
        return Joi.object({
            body: Joi.object({
                oy_1: Joi.number().required(),
                oy_2: Joi.number().required(),
                oy_3: Joi.number().required(),
                oy_4: Joi.number().required(),
                oy_5: Joi.number().required(),
                oy_6: Joi.number().required(),
                oy_7: Joi.number().required(),
                oy_8: Joi.number().required(),
                oy_9: Joi.number().required(),
                oy_10: Joi.number().required(),
                oy_11: Joi.number().required(),
                oy_12: Joi.number().required(),
                smeta_id: Joi.number().integer().min(1).required(),
                id_shartnomalar_organization: Joi.number().integer().min(1).required()
            }),
            query: Joi.object({
                budjet_id: Joi.number().integer().min(1).required()
            }),
            params: Joi.object({
                id: Joi.number().integer().min(1).required()
            })
        }).options({ stripUnknown: true });
    }
}