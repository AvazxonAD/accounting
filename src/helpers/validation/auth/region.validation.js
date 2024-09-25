const Joi = require("joi");

const regionValidation = Joi.object({
    name: Joi.string().required()
});

module.exports = {
    regionValidation
};
