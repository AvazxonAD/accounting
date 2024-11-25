const Joi = require('joi')

exports.createPereotsenkaSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim(),
    oy_1: Joi.number(),
    oy_2: Joi.number(),
    oy_3: Joi.number(),
    oy_4: Joi.number(),
    oy_5: Joi.number(),
    oy_6: Joi.number(),
    oy_7: Joi.number(),
    oy_8: Joi.number(),
    oy_9: Joi.number(),
    oy_10: Joi.number(),
    oy_11: Joi.number(),
    oy_12: Joi.number()
  })
}).options({ stripUnknown: true });

exports.updatePereotsenkaSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim(),
    oy_1: Joi.number(),
    oy_2: Joi.number(),
    oy_3: Joi.number(),
    oy_4: Joi.number(),
    oy_5: Joi.number(),
    oy_6: Joi.number(),
    oy_7: Joi.number(),
    oy_8: Joi.number(),
    oy_9: Joi.number(),
    oy_10: Joi.number(),
    oy_11: Joi.number(),
    oy_12: Joi.number()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
})

exports.getPereotsenkaSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.getByIdPereotsenkaSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deletePereotsenkaSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });