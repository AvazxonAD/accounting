const Joi = require('joi');

exports.DashboardSchema = class {
    static kassa() {
        return Joi.object({
            query: Joi.object({
                main_schet_id: Joi.number().integer().allow(null, '').min(1),
                budjet_id: Joi.number().integer().allow(null, '').min(1),
                to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
            })
        }).options({ stripUnknown: true });
    }

    static bank() {
        return Joi.object({
            query: Joi.object({
                main_schet_id: Joi.number().integer().allow(null, '').min(1),
                budjet_id: Joi.number().integer().allow(null, '').min(1),
                to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
            })
        }).options({ stripUnknown: true });
    }

    static podotchet() {
        return Joi.object({
            query: Joi.object({
                main_schet_id: Joi.number().integer().allow(null, '').min(1),
                budjet_id: Joi.number().integer().allow(null, '').min(1),
                to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(), 
                page: Joi.number().min(1).integer().default(1),
                limit: Joi.number().min(1).integer().default(99999)
            })
        }).options({ stripUnknown: true });
    }
}