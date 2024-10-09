const Joi = require("joi");

const podrazdelenieValidation = Joi.object({
  name: Joi.string().required(),
  rayon: Joi.string().required(),
}).options({ stripUnknown: true });

module.exports = {
  podrazdelenieValidation,
};
