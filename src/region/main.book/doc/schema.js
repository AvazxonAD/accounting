const Joi = require('joi')

exports.DocSchema = class {
  static auto() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1),
        main_schet_id: Joi.number().integer().min(1),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1901).required(),
        type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end').required()
      })
    }).options({ stripUnknown: true });
  }
}

exports.createDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    childs: Joi.array().required().items(
      Joi.object({
        spravochnik_main_book_schet_id: Joi.number().required().min(1),
        kredit_sum: Joi.number().default(0).min(0),
        debet_sum: Joi.number().default(0).min(0)
      })
    )
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    childs: Joi.array().required().items(
      Joi.object({
        spravochnik_main_book_schet_id: Joi.number().required().min(1),
        kredit_sum: Joi.number().default(0).min(0),
        debet_sum: Joi.number().default(0).min(0)
      })
    )
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1),
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(1901),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end')
  })
}).options({ stripUnknown: true });

exports.getByIdDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end')
  })
}).options({ stripUnknown: true });

exports.deleteDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end')
  })
}).options({ stripUnknown: true });

exports.auto = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required()
  })
}).options({ stripUnknown: true });