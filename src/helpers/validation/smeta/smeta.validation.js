const Joi = require('joi')

const smetaValidation = Joi.object({
    smeta_name: Joi.string().required(),
    smeta_number: Joi.number().required().required(),
    father_smeta_name: Joi.string().required()
})

const smetaGrafikValidation = Joi.object({
    smeta_id: Joi.number().required().required(), 
    spravochnik_budjet_name_id: Joi.number().required().required(), 
    year: Joi.number().required().required()
}).options({ stripUnknown: true });

const smetaGrafikUpdateValidation = Joi.object({
    oy_1: Joi.number().required(),
    oy_2: Joi.number().required(),
    oy_3: Joi.number().required(),
    oy_4: Joi.number().required(),
    oy_5: Joi.number().required(),
    oy_6: Joi.number().required(),
    oy_7: Joi.number().required(),
    oy_8: Joi.number().required(),
    oy_9: Joi.number().required(),
    oy_10: Joi.number().required(),
    oy_11: Joi.number().required(),
    oy_12: Joi.number().required(),
}).options({ stripUnknown: true });


module.exports = { 
    smetaValidation,
    smetaGrafikValidation,
    smetaGrafikUpdateValidation
 }