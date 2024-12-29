const Joi = require('joi')

exports.createDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    childs: Joi.array().required().items(
      Joi.object({
        smeta_grafik_id: Joi.number().required().min(1),
        kredit_sum: Joi.number().default(0),
        debet_sum: Joi.number().default(0)
      })
    )
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    childs: Joi.array().required().items(
      Joi.object({
        smeta_grafik_id: Joi.number().required().min(1),
        kredit_sum: Joi.number().default(0),
        debet_sum: Joi.number().default(0)
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

exports.getDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getByIdDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });