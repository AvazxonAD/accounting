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

  static create() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        kimga_id: Joi.number().integer().min(1).required(),
        childs: Joi.array().required().items(
          Joi.object({
            group_jur7_id: Joi.number().required(),
            kol: Joi.number().min(1).required(),
            summa: Joi.number().min(1).required(),
            nds_foiz: Joi.number().min(1).allow(0).max(99).default(0),
            debet_schet: Joi.string().trim(),
            debet_sub_schet: Joi.string().trim(),
            kredit_schet: Joi.string().trim(),
            kredit_sub_schet: Joi.string().trim(),
            iznos: Joi.boolean().required(),
            name: Joi.string().trim().required(),
            edin: Joi.string().trim().required(),
            inventar_num: Joi.string().trim(),
            serial_num: Joi.string().trim(),
            eski_iznos_summa: Joi.number().min(0).default(0)
          })
        )
      }),

      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }
}

exports.getSaldoSchema = Joi.object({
  query: Joi.object({
    kimning_buynida: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    product_id: Joi.number().integer().min(1),
    search: Joi.string().trim(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
  })
}).options({ stripUnknown: true });