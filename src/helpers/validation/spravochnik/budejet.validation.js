const Joi = require("joi");

const budjetValidation = Joi.object({
    name: Joi.string().required()
});

module.exports = {
    budjetValidation
};
