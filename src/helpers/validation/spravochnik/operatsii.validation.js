const Joi = require("joi");

const operatsiiValidation = Joi.object({
  name: Joi.string().trim().required(),
  schet: Joi.string().trim().required(),
  sub_schet: Joi.string().trim().required(),
  type_schet: Joi.string().trim().required(),
  smeta_id: Joi.number().required(),
}).options({ stripUnknown: true });

const queryValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  search: Joi.string().trim()
}).options({ stripUnknown: true });

module.exports = {
  operatsiiValidation,
  queryValidation
};
