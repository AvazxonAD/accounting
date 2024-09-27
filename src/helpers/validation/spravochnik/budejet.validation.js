const Joi = require("joi");

const budjetValidation = Joi.object({
  name: Joi.string().required(),
}).options({ stripUnknown: true });

module.exports = {
  budjetValidation,
};
