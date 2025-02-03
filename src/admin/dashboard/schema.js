const Joi = require('joi');

exports.DashboardSchema = class {
    static get() {
        return Joi.object({
            query: Joi.object({
                main_schet_id: Joi.number().required().min(1),
                to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
            })
        }).options({ stripUnknown: true });
    }
}