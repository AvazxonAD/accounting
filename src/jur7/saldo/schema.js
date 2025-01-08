const Joi = require('joi')

exports.createSaldoSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    kimning_buynida: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateSaldoSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    main_schet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.getSaldoSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(1900),
    kimning_buynida: Joi.number().integer().min(1)
  })
}).options({ stripUnknown: true });

exports.getInfoSaldoSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    kimning_buynida: Joi.number().integer().min(1).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.deleteSaldoSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    kimning_buynida: Joi.number().integer().min(1).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });