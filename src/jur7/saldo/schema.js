const Joi = require('joi')

exports.createSaldoSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.getSaldoSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    kimning_buynida: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getSaldoRasxodSchema = Joi.object({
  query: Joi.object({
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    kimning_buynida: Joi.number().integer().min(1).required(),
    product_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });