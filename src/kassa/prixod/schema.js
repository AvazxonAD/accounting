const Joi = require('joi');

exports.KassaPrixodSchema = class {
    static createSchema() {
        return Joi.object({
            body: Joi.object({
                doc_num: Joi.string().trim(),
                doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
                opisanie: Joi.string().trim(),
                id_podotchet_litso: Joi.number(),
                main_zarplata_id: Joi.number().allow(null),
                childs: Joi.array()
                    .items(
                        Joi.object({
                            spravochnik_operatsii_id: Joi.number().required(),
                            summa: Joi.number().required(),
                            id_spravochnik_podrazdelenie: Joi.number(),
                            id_spravochnik_sostav: Joi.number(),
                            id_spravochnik_type_operatsii: Joi.number(),
                        }),
                    ).min(1)
            }),
            query: Joi.object({
                main_schet_id: Joi.number().required().min(1)
            })
        }).options({ stripUnknown: true });
    }

    static getSchema() {
        return Joi.object({
            query: Joi.object({
                main_schet_id: Joi.number().required().min(1),
                limit: Joi.number().min(1).default(10),
                page: Joi.number().min(1).default(1),
                from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
                to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
            })
        }).options({ stripUnknown: true }); 
    }

    static getById() {
        return Joi.object({
            query: Joi.object({
                main_schet_id: Joi.number().required().min(1)
            }),
            params: Joi.object({
                id: Joi.number().required().min(1)
            })
        })
    }

    static updateSchema() {
        return Joi.object({
            body: Joi.object({
                doc_num: Joi.string().trim(),
                doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
                opisanie: Joi.string().trim(),
                id_podotchet_litso: Joi.number(),
                main_zarplata_id: Joi.number().allow(null),
                childs: Joi.array()
                    .items(
                        Joi.object({
                            spravochnik_operatsii_id: Joi.number().required(),
                            summa: Joi.number().required(),
                            id_spravochnik_podrazdelenie: Joi.number(),
                            id_spravochnik_sostav: Joi.number(),
                            id_spravochnik_type_operatsii: Joi.number(),
                        }),
                    ).min(1)
            }),
            query: Joi.object({
                main_schet_id: Joi.number().required().min(1)
            }),
            params: Joi.object({
                id: Joi.number().required().min(1)
            })
        }).options({ stripUnknown: true });
    }
}