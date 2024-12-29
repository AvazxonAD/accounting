const Joi = require('joi')

exports.createEndSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    data: Joi.array().required().items(
      Joi.object({
        type: Joi.string().trim().required(),
        grafiks: Joi.array().required().items(
          Joi.object({
            id: Joi.number().integer().min(1).required(),
            summa: Joi.object({
              debet_sum: Joi.number().required(),
              kredit_sum: Joi.number().required()
            }).required()
          })
        )
      })
    )
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateEndSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    data: Joi.array().required().items(
      Joi.object({
        type: Joi.string().trim().required(),
        grafiks: Joi.array().required().items(
          Joi.object({
            id: Joi.number().integer().min(1).required(),
            summa: Joi.object({
              debet_sum: Joi.number().required(),
              kredit_sum: Joi.number().required()
            }).required()
          })
        )
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

exports.getEndSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getInfoEndSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.deleteEndSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
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