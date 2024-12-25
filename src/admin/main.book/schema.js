const Joi = require('joi')

exports.updateEndSchema = Joi.object({
  body: Joi.object({
    status: Joi.number().valid(2, 3).required()
  }),
  query: Joi.object({
    region_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getEndSchema = Joi.object({
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  query: Joi.object({
    region_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });