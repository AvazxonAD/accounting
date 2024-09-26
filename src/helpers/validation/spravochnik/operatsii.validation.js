const Joi = require("joi");

const operatsiiValidation = Joi.object({
    name: Joi.string().required(),
    schet: Joi.string().required(),
    sub_schet: Joi.string().required(),
    type_schet: Joi.string().required()

}).options({ stripUnknown: true })

module.exports = {
    operatsiiValidation
};
