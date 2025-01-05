const Joi = require('joi')

exports.createReportSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateReportSchema = Joi.object({
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

exports.getReportSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(1900)
  })
}).options({ stripUnknown: true });

exports.getInfoReportSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.deleteReportSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });