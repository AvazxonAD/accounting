const Joi = require("joi");

const organizationValidation = Joi.object({
    name: Joi.string().required(),
    bank_klient: Joi.string().required(),
    raschet_schet: Joi.string().required().length(20),
    raschet_schet_gazna: Joi.string().required(),
    mfo: Joi.string().required(),
    inn: Joi.string().length(9).required(),
    okonx: Joi.string().required()
}).options({ stripUnknown: true })

module.exports = {
    organizationValidation
};
