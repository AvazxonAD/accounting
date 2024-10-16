const Joi = require("joi");

const userValidation = Joi.object({
  login: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  fio: Joi.string().trim().required(),
  role_id: Joi.number(),
  region_id: Joi.number(),
}).options({ stripUnknown: true });

module.exports = {
  userValidation,
};
