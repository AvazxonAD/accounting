const Joi = require("joi");

const regionValidation = Joi.object({
  name: Joi.string().trim().required(),
}).options({ stripUnknown: true });

module.exports = {
  regionValidation,
};
