const Joi = require("joi");

const shartnomaValidation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  summa: Joi.number(),
  opisanie: Joi.string().trim(),
  smeta_id: Joi.number().required(),
  smeta2_id: Joi.number(),
  spravochnik_organization_id: Joi.number().required(),
  pudratchi_bool: Joi.boolean()
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

const queryValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  main_schet_id: Joi.number().min(1),
  organization: Joi.number().min(1),
  pudratchi: Joi.string().pattern(/^(true|false)$/),
  search: Joi.string().trim()
}).options({ stripUnknown: true });

module.exports = {
  shartnomaValidation,
  shartnomaGarfikValidation,
  queryValidation
};
