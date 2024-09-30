const Joi = require('joi')

const shartnomaValidation = Joi.object({
    doc_num: Joi.string(),
    doc_date: Joi.date(),
    summa: Joi.number(),
    opisanie: Joi.string(),
    smeta_id: Joi.number().required(),
    smeta_2: Joi.string(),
    spravochnik_organization_id: Joi.number().required(),
    pudratchi_bool: Joi.boolean()
})


module.exports = { 
    shartnomaValidation,
 }