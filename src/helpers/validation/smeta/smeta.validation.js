const Joi = require('joi')

const smetaValidation = Joi.object({
    smeta_name: Joi.string().required(),
    smeta_number: Joi.number().required(),
    father_smeta_name: Joi.string().required()
})

const smetaGrafikValidation = Joi.object({
    smeta_id: Joi.number().required(), 
    spravochnik_budjet_name_id: Joi.number().required(), 
    year: Joi.number().required()
})


module.exports = { 
    smetaValidation,
    smetaGrafikValidation
 }