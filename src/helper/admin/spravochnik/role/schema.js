const Joi = require('joi');

exports.createSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required(),
    })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required(),
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


exports.RoleSchema = class {
    static get() {
        return Joi.object({
            query: Joi.object({
                page: Joi.number().min(1).integer().default(1),
                limit: Joi.number().min(1).integer().default(10),
                search: Joi.string().trim()
            })
        }).options({ stripUnknown: true });
    }
}