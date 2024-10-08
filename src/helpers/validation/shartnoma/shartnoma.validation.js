const Joi = require("joi");

const shartnomaValidation = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.date(),
  summa: Joi.number(),
  opisanie: Joi.string(),
  smeta_id: Joi.number().required(),
  smeta2_id: Joi.number(),
  spravochnik_organization_id: Joi.number().required(),
  pudratchi_bool: Joi.boolean(),
  grafik_year: Joi.number().required(),
}).options({ stripUnknown: true });

const shartnomaGarfikValidation = Joi.object({
  oy_1: Joi.number().required(),
  oy_2: Joi.number().required(),
  oy_3: Joi.number().required(),
  oy_4: Joi.number().required(),
  oy_5: Joi.number().required(),
  oy_6: Joi.number().required(),
  oy_7: Joi.number().required(),
  oy_8: Joi.number().required(),
  oy_9: Joi.number().required(),
  oy_10: Joi.number().required(),
  oy_11: Joi.number().required(),
  oy_12: Joi.number().required(),
}).options({ stripUnknown: true });

module.exports = {
  shartnomaValidation,
  shartnomaGarfikValidation,
};
