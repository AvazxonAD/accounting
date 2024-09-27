const Joi = require('joi')

const smetaValidation = Joi.object({
    smeta_name: Joi.string().required(),
    smeta_number: Joi.number().required(),
    father_smeta_name: Joi.string().required()
})


module.exports = { 
    smetaValidation
 }