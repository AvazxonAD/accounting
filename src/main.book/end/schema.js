const Joi = require('joi')

exports.createEndSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1900).required(),
    data: Joi.array().required().items(
      Joi.object({
        key: Joi.string().trim().required(),
        schets: Joi.array().required().items(
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
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateEndSchema = Joi.object({
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

exports.getEndSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getByIdEndSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    type_document: Joi.string().trim(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });

exports.deleteEndSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    type_document: Joi.string().trim(),
    year: Joi.number().integer().min(1900).required()
  })
}).options({ stripUnknown: true });