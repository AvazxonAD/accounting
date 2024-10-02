const Joi = require("joi");

const organizationValidation = Joi.object({
  name: Joi.string().required(),
  bank_klient: Joi.string().required(),
  raschet_schet: Joi.string().required(),
  raschet_schet_gazna: Joi.string().required(),
  mfo: Joi.string().required(),
  inn: Joi.string().required(),
  okonx: Joi.string().required(),
}).options({ stripUnknown: true });

module.exports = {
  organizationValidation,
};
