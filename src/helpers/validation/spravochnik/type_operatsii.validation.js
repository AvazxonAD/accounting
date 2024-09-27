const Joi = require("joi");

const typeOperatsiiValidation = Joi.object({
  name: Joi.string().required(),
  rayon: Joi.string().required(),
}).options({ stripUnknown: true });

module.exports = {
  typeOperatsiiValidation,
};
