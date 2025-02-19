const Joi = require('joi')

exports.SaldoSchema = class {
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
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  })
}).options({ stripUnknown: true });

exports.getSaldoRasxodSchema = Joi.object({
  query: Joi.object({
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    kimning_buynida: Joi.number().integer().min(1).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10)
  })
}).options({ stripUnknown: true });