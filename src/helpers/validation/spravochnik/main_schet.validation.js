const Joi = require("joi");

const mainSchetValidator = Joi.object({
  spravochnik_budjet_name_id: Joi.number().required(),
  account_number: Joi.string().trim().trim().required(),
  tashkilot_nomi: Joi.string().trim().required(),
  tashkilot_bank: Joi.string().trim().required(),
  tashkilot_mfo: Joi.string().trim().required(),
  tashkilot_inn: Joi.string().trim().required(),
  account_name: Joi.string().trim().required(),
  jur1_schet: Joi.string().trim(),
  jur1_subschet: Joi.string().trim(),
  jur2_schet: Joi.string().trim(),
  jur2_subschet: Joi.string().trim(),
  jur3_schet: Joi.string().trim(),
  jur3_subschet: Joi.string().trim(),
  jur4_schet: Joi.string().trim(),
  jur4_subschet: Joi.string().trim(),
}).options({ stripUnknown: true });

const queryMainSchetValidation = Joi.object({
  limit: Joi.number().min(1).default(10),
  page: Joi.number().min(1).default(1),
  search: Joi.string().trim()
}).options({ stripUnknown: true });

module.exports = {
  mainSchetValidator,
  queryMainSchetValidation,
};
