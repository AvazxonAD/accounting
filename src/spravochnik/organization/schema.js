const Joi = require('joi')


exports.OrganizationSchema = class {
    static import() {
        return Joi.object({
            file: Joi.object({
                path: Joi.string().trim().required()
            })
        })
    }

    static importData(lang) {
        return Joi.array().items({

        });
    }

    static create() {
        return Joi.object({
            body: Joi.object({
                name: Joi.string().trim().required(),
                bank_klient: Joi.string().trim().required(),
                mfo: Joi.string().trim().required(),
                inn: Joi.string().trim().required(),
                okonx: Joi.string().trim().required(),
                parent_id: Joi.number().min(1).allow(null),
                gaznas: Joi.array().items(
                    Joi.object({
                        raschet_schet_gazna: Joi.string().trim().required()
                    })
                ),
                account_numbers: Joi.array().items(
                    Joi.object({
                        raschet_schet: Joi.string().trim().required()
                    })
                ).empty()
            })
        }).options({ stripUnknown: true });
    }

    static update() {
        return Joi.object({
            body: Joi.object({
                name: Joi.string().trim().required(),
                bank_klient: Joi.string().trim().required(),
                mfo: Joi.string().trim().required(),
                inn: Joi.string().trim().required(),
                okonx: Joi.string().trim().required(),
                parent_id: Joi.number().min(1).allow(null)
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
                search: Joi.string()
            })
        }).options({ stripUnknown: true });
    }
}