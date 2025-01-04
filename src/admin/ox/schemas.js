const Joi = require('joi')

exports.confirmSchema = Joi.object({
  body: Joi.object({
    status: Joi.number().integer().valid(2, 3).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });