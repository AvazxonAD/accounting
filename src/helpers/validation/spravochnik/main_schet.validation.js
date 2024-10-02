const Joi = require("joi");

const mainSchetValidator = Joi.object({
  spravochnik_budjet_name_id: Joi.number().required(),
  account_number: Joi.string().trim().required(),
  tashkilot_nomi: Joi.string().required(),
  tashkilot_bank: Joi.string().required(),
  tashkilot_mfo: Joi.string().required(),
  tashkilot_inn: Joi.string().required(),
  account_name: Joi.string().required(),
  jur1_schet: Joi.string(),
  jur1_subschet: Joi.string(),
  jur2_schet: Joi.string(),
  jur2_subschet: Joi.string(),
  jur3_schet: Joi.string(),
  jur3_subschet: Joi.string(),
  jur4_schet: Joi.string(),
  jur4_subschet: Joi.string(),
}).options({ stripUnknown: true });

const queryMainSchetValidation = Joi.object({
  limit: Joi.number(),
  page: Joi.number(),
}).options({ stripUnknown: true });

module.exports = {
  mainSchetValidator,
  queryMainSchetValidation,
};
