const Joi = require("joi");

const operatsiiValidation = Joi.object({
  name: Joi.string().required(),
  schet: Joi.string().required(),
  sub_schet: Joi.string().required(),
  type_schet: Joi.string().required(),
  smeta_id: Joi.number().required(),
}).options({ stripUnknown: true });

const queryValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  type_schet: Joi.string()
}).options({ stripUnknown: true });

module.exports = {
  operatsiiValidation,
  queryValidation
};
