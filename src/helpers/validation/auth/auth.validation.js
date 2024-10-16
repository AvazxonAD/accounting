const Joi = require("joi");

const authValidation = Joi.object({
  login: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  main_schet_id: Joi.number(),
}).options({ stripUnknown: true });

const authUpdateValidation = Joi.object({
  fio: Joi.string().trim().required().trim(),
  login: Joi.string().trim().required().trim(),
  oldPassword: Joi.string().trim().required(),
  newPassword: Joi.string().trim().required(),
}).options({ stripUnknown: true });

module.exports = {
  authValidation,
  authUpdateValidation,
};
