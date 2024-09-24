const Joi = require("joi");

const mainSchetValidator = Joi.object({
  spravochnik_budjet_name_id: Joi.number().required(),
  account_number: Joi.string().trim().required(),
  tashkilot_nomi: Joi.string().required(),
  tashkilot_bank: Joi.string().required(),
  tashkilot_mfo: Joi.string().required(),
  tashkilot_inn: Joi.number().required(),
  account_name: Joi.string().required(),
  jur1_schet: Joi.string().length(5).required(),
  jur1_subschet: Joi.string().length(7).required(),
  jur2_schet: Joi.string().length(5).required(),
  jur2_subschet: Joi.string().length(7).required(),
  jur3_schet: Joi.string().length(5).required(),
  jur3_subschet: Joi.string().length(7).required(),
  jur4_schet: Joi.string().length(5).required(),
  jur4_subschet: Joi.string().length(7).required(),
});

module.exports = {
  mainSchetValidator,
};
