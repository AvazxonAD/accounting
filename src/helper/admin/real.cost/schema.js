const Joi = require('joi')

exports.updateReportSchema = Joi.object({
  body: Joi.object({
    status: Joi.number().integer().valid(2, 3).required()
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    region_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getReportSchema = Joi.object({
  query: Joi.object({
    region_id: Joi.number().integer().min(1),
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(1901),
  })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    region_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });