const Joi = require('joi')

exports.createSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    childs: Joi.array().required().items(
      Joi.object({
        smeta_grafik_id: Joi.number().required().min(1),
        allocated_amount: Joi.number().default(0),
        by_smeta: Joi.number().default(0),
        kassa_rasxod: Joi.number().default(0),
        real_rasxod: Joi.number().default(0),
      })
    )
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    childs: Joi.array().required().items(
      Joi.object({
        smeta_grafik_id: Joi.number().required().min(1),
        allocated_amount: Joi.number().default(0),
        by_smeta: Joi.number().default(0),
        kassa_rasxod: Joi.number().default(0),
        real_rasxod: Joi.number().default(0),
        remaining: Joi.number().default(0)
      })
    )
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.sendSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });