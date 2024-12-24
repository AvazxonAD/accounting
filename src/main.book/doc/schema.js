const Joi = require('joi')

exports.createDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    type_document: Joi.string().trim(),
    childs: Joi.array().required().items(
      Joi.object({
        spravochnik_operatsii_id: Joi.number().required().min(1),
        kredit_sum: Joi.number().min(1).required(),
        debet_sum: Joi.number().min(1).required()
      })
    )
  }),
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    type_document: Joi.string().trim(),
    childs: Joi.array().required().items(
      Joi.object({
        spravochnik_operatsii_id: Joi.number().required().min(1),
        kredit_sum: Joi.number().min(1).required(),
        debet_sum: Joi.number().min(1).required()
      })
    )
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  }),
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getDocSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    type: Joi.string().trim(),
    main_schet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.getByIdDocSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  }),
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteDocSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  }),  
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });