const Joi = require('joi')

exports.ResponsibleSchema = class {
  static importFile() {
    return Joi.object({
      file: Joi.object({
        path: Joi.string().trim().required()
      })
    })
  }

  static importData(lang) {
    return Joi.array().items(
      Joi.object({
        spravochnik_podrazdelenie_jur7_id: Joi.number().min(1).required().messages({ '*': lang.t('validation.podrazId') }),
        fio: Joi.string().trim().required().messages({ '*': lang.t('validation.responsibleFio') })
      })
    ).options({ stripUnknown: true });
  }
}

exports.createResponsibleSchema = Joi.object({
  body: Joi.object({
    fio: Joi.string().trim(),
    spravochnik_podrazdelenie_jur7_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateResponsibleSchema = Joi.object({
  body: Joi.object({
    fio: Joi.string().trim(),
    spravochnik_podrazdelenie_jur7_id: Joi.number().integer().min(1).required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
})

exports.getResponsibleSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim(),
    podraz_id: Joi.number().integer().min(1)
  })
}).options({ stripUnknown: true });

exports.getByIdResponsibleSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteResponsibleSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });