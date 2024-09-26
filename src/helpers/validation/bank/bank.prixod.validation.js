const Joi = require("joi");

const bankPrixodValidator = Joi.object({
    doc_num: Joi.string(),
    doc_date: Joi.date(),
    summa: Joi.number(),
    opisanie: Joi.string(),
    id_spravochnik_organization: Joi.number().required(),
    id_shartnomalar_organization: Joi.number(),
    spravochnik_operatsii_own_id: Joi.number().required(),
    childs: Joi.array().required(),
}).options({ stripUnknown: true })

const bankPrixodChildValidation = Joi.object({
    summa: Joi.number().required(),
    spravochnik_operatsii_id: Joi.number().required(),
    id_spravochnik_podrazdelenie: Joi.number().required(),
    id_spravochnik_sostav: Joi.number(),
    id_spravochnik_type_operatsii: Joi.number(),
    id_spravochnik_podotchet_litso: Joi.number(),
}).options({ stripUnknown: true })

const queryValidationBank = Joi.object({
    main_schet_id: Joi.number(), 
    limit: Joi.number(), 
    page: Joi.number(),
    from: Joi.date(),
    to: Joi.date()
})


module.exports = {
    bankPrixodValidator,
    bankPrixodChildValidation,
    queryValidationBank
};
