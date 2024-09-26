const Joi = require("joi");

const podotchetLitsoValidation = Joi.object({
    name: Joi.string().required(),
    rayon: Joi.string().required()
}).options({ stripUnknown: true })

module.exports = {
    podotchetLitsoValidation
};
