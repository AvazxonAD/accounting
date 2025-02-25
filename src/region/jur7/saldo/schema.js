const Joi = require('joi')

exports.SaldoSchema = class {
  static import() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required()
      }),
      file: Joi.object({
        path: Joi.string().trim().required()
      })
    })
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        product_id: Joi.number().integer().min(1).required()
      })
    })
  }

  static importData(lang) {
    return Joi.array().items(
      Joi.object({
        responsible_id: Joi.number().min(1).required().messages({ '*': lang.t('validation.responsibleId') }),
        group_jur7_id: Joi.number().required().messages({ '*': lang.t('validation.groupId') }),
        doc_date: Joi.string().trim().pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/).messages({ '*': lang.t('validation.importDocDate') }),
        doc_num: Joi.number().required().messages({ '*': lang.t('validation.docNum') }),
        name: Joi.string().trim().required().messages({ '*': lang.t('validation.productName') }),
        edin: Joi.string().trim().required().messages({ '*': lang.t('validation.edin') }),
        kol: Joi.number().min(1).required().messages({ '*': lang.t('validation.kol') }),
        summa: Joi.number().min(1).required().messages({ '*': lang.t('validation.summa') }),
        inventar_num: Joi.any().messages({ '*': lang.t('validation.inventarNum') }),
        serial_num: Joi.any().messages({ '*': lang.t('validation.serialNum') }),
        iznos: Joi.any().messages({ '*': lang.t('validation.iznos') }),
        eski_iznos_summa: Joi.number().min(0).default(0).messages({ '*': lang.t('validation.eskiIznosSumma') })
      })
    ).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        kimning_buynida: Joi.number().integer().min(1),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        product_id: Joi.number().integer().min(1),
        iznos: Joi.string().valid('true', 'false'),
        search: Joi.string().trim(),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
      })
    }).options({ stripUnknown: true })
  }

  static create() {
    return Joi.object({
      body: Joi.object({
        year: Joi.number().min(1901).max(2099).required().integer(),
        month: Joi.number().min(1).max(12).required().integer()
      }),

      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }
}