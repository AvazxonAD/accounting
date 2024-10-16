const Joi = require("joi");

const sostavValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required(),
}).options({ stripUnknown: true });

module.exports = {
  sostavValidation,
};
