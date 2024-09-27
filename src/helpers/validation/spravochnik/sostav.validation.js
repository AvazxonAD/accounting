const Joi = require("joi");

const sostavValidation = Joi.object({
  name: Joi.string().required(),
  rayon: Joi.string().required(),
}).options({ stripUnknown: true });

module.exports = {
  sostavValidation,
};
