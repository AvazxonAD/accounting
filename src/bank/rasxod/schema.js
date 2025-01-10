const Joi = require('joi');

exports.createSchema = Joi.object({
    body: Joi.object({
        doc_num: Joi.string().trim().required(),
        doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        opisanie: Joi.string().trim(),
        id_spravochnik_organization: Joi.number().required(),
        id_shartnomalar_organization: Joi.number().allow(null),
        rukovoditel: Joi.string(),
        glav_buxgalter: Joi.string(),
        childs: Joi.array().required().min(1).items(
            Joi.object({
                summa: Joi.number().required().min(0),
                spravochnik_operatsii_id: Joi.number().min(1).integer().required(),
                id_spravochnik_podrazdelenie: Joi.number().allow(null).min(1).integer(),
                id_spravochnik_sostav: Joi.number().allow(null).min(1).integer(),
                id_spravochnik_type_operatsii: Joi.number().allow(null).min(1).integer(),
                main_zarplata_id: Joi.number().allow(null).min(1).integer(),
                id_spravochnik_podotchet_litso: Joi.number().allow(null).min(1).integer()
            })
        )
    }),
    query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
    body: Joi.object({
        doc_num: Joi.string().trim().required(),
        doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        opisanie: Joi.string().trim(),
        id_spravochnik_organization: Joi.number().required(),
        id_shartnomalar_organization: Joi.number().allow(null),
        rukovoditel: Joi.string(),
        glav_buxgalter: Joi.string(),
        childs: Joi.array().required().min(1).items(
            Joi.object({
                summa: Joi.number().required().min(0),
                spravochnik_operatsii_id: Joi.number().min(1).integer().required(),
                id_spravochnik_podrazdelenie: Joi.number().allow(null).min(1).integer(),
                id_spravochnik_sostav: Joi.number().allow(null).min(1).integer(),
                id_spravochnik_type_operatsii: Joi.number().allow(null).min(1).integer(),
                main_zarplata_id: Joi.number().allow(null).min(1).integer(),
                id_spravochnik_podotchet_litso: Joi.number().allow(null).min(1).integer()
            })
        )
    }),
    query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required()
    }),
    params: Joi.object({
        id: Joi.number().min(1).integer().required()
    })
}).options({ stripUnknown: true });