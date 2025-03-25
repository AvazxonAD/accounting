const Joi = require('joi')

exports.createMainBookSchetSchema = Joi.object({
  body : Joi.object({
    name: Joi.string().trim(),
    schet: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.updateMainBookSchetSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim(),
    schet: Joi.string().trim()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
})

exports.getMainBookSchetSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.getByIdMainBookSchetSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteMainBookSchetSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });