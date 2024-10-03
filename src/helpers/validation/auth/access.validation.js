const Joi = require("joi");

const accessValidation = Joi.object({
  kassa: Joi.boolean().default(false),
  bank: Joi.boolean().default(false),
  spravochnik: Joi.boolean().default(false),
  organization: Joi.boolean().default(false),
  region_users: Joi.boolean().default(false),
  smeta: Joi.boolean().default(false),
  region: Joi.boolean().default(false),
  role: Joi.boolean().default(false),
  users: Joi.boolean().default(false),
  shartnoma: Joi.boolean().default(false),
  jur3: Joi.boolean().default(false),
  jur4: Joi.boolean().default(false)
}).options({ stripUnknown: true });

module.exports = {
  accessValidation
};
