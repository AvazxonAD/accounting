const Joi = require("joi");

const budjetValidation = Joi.object({
  name: Joi.string().trim().required(),
}).options({ stripUnknown: true });

module.exports = {
  budjetValidation,
};
