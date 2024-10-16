const Joi = require("joi");

const typeOperatsiiValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required(),
}).options({ stripUnknown: true });

module.exports = {
  typeOperatsiiValidation,
};
