const Joi = require('joi')

const pereotsenkaValidation = Joi.object({
    name: Joi.string().trim(),
    oy_1: Joi.number(),
    oy_2: Joi.number(),
    oy_3: Joi.number(),
    oy_4: Joi.number(),
    oy_5: Joi.number(),
    oy_6: Joi.number(),
    oy_7: Joi.number(),
    oy_8: Joi.number(),
    oy_9: Joi.number(),
    oy_10: Joi.number(),
    oy_11: Joi.number(),
    oy_12: Joi.number()
})


const groupValidation = Joi.object({
    pereotsenka_jur7_id: Joi.number().required(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    provodka_subschet: Joi.string().trim(),
    provodka_kredit: Joi.string().trim()
});

const podrazdelenieValidation = Joi.object({
    name: Joi.string().trim()
});

module.exports = { pereotsenkaValidation, groupValidation, podrazdelenieValidation }
