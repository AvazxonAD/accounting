const Joi = require('joi')


exports.GaznaSchema = class {
    static import() {
        return Joi.object({
            file: Joi.object({
                path: Joi.string().trim().required()
            })
        })
    }

    static create() {
        return Joi.object({
            body: Joi.object({
                raschet_schet_gazna: Joi.string().trim().required(),
                spravochnik_organization_id: Joi.number().min(1).integer().required()
            })
        }).options({ stripUnknown: true });
    }

    static update() {
        return Joi.object({
            body: Joi.object({
                raschet_schet_gazna: Joi.string().trim().required(),
                spravochnik_organization_id: Joi.number().min(1).integer().required()
            }),
            params: Joi.object({
                id: Joi.number().integer().min(1).required()
            })
        }).options({ stripUnknown: true });
    }

    static delette() {
        return Joi.object({
            params: Joi.object({
                id: Joi.number().integer().min(1).required()
            })
        });
    }

    static getById() {
        return Joi.object({
            params: Joi.object({
                id: Joi.number().integer().min(1).required()
            })
        });
    }

    static get() {
        return Joi.object({
            query: Joi.object({
                page: Joi.number().min(1).default(1),
                limit: Joi.number().min(1).default(10),
                organ_id: Joi.number().integer().min(1),
                search: Joi.string()
            })
        }).options({ stripUnknown: true });
    }
}