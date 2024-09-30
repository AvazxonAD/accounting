const Joi = require("joi");

const userValidation = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
  fio: Joi.string().required(),
  role_id: Joi.number().required(),
  region_id: Joi.number().required(),
}).options({ stripUnknown: true });

module.exports = {
  userValidation,
};
