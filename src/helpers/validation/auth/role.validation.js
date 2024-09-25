const Joi = require("joi");

const roleValidation = Joi.object({
    name: Joi.string().required()
});

module.exports = {
    roleValidation
};
