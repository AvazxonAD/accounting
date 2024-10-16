const Joi = require("joi");

const organizationValidation = Joi.object({
  name: Joi.string().trim().required(),
  bank_klient: Joi.string().trim().required(),
  raschet_schet: Joi.string().trim().required(),
  raschet_schet_gazna: Joi.string().trim().required(),
  mfo: Joi.string().trim().required(),
  inn: Joi.string().trim().required(),
  okonx: Joi.string().trim().required(),
}).options({ stripUnknown: true });

const queryValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  inn: Joi.number()
}).options({ stripUnknown: true });

module.exports = {
  organizationValidation,
  queryValidation
};
