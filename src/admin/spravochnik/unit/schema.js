const Joi = require('joi')

exports.createUnitSchema = Joi.object({
  body : Joi.object({
    name: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.updateUnitSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
})

exports.getByIdUnitSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteUnitSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });