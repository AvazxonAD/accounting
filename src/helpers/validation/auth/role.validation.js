const Joi = require("joi");

const roleValidation = Joi.object({
  name: Joi.string().trim().required(),
}).options({ stripUnknown: true });

module.exports = {
  roleValidation,
};
