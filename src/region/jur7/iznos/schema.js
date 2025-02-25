const Joi = require('joi');

exports.IznosSchema = class {
  static get() {
    return Joi.object({
      query: Joi.object({
        product_id: Joi.number().integer().min(1),
        responsible_id: Joi.number().integer().min(1),
        search: Joi.string().trim().allow(null, ''),
        year: Joi.number().integer().min(1900),
        month: Joi.number().integer().min(1).max(12),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      })
    }).options({ stripUnknown: true });
  }

  static create() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required()
      }),

      body: Joi.object({
        year: Joi.number().integer().min(1900).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        products: Joi.array().items(
          Joi.object({
            id: Joi.number().integer().min(1).required(),
            inventar_num: Joi.string(),
            serial_num: Joi.string(),
            iznos_data: Joi.object({
              eski_iznos_summa: Joi.number().min(0).required(),
              iznos_summa: Joi.number().required(),
              summa: Joi.number().required(),
              year: Joi.number().integer().min(2000).max(2100).required(),
              month: Joi.number().integer().min(1).max(12).required(),
              kol: Joi.number().integer().min(1).required(),
              sena: Joi.number().integer().min(0).required(),
              new_summa: Joi.number().required(),
              responsible_id: Joi.number().integer().min(1).required()
            })
          })
        ).required().min(1)
      })
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required()
      }),
      body: Joi.object({
        iznos_start_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        eski_iznos_summa: Joi.number().integer().min(0).required()
      })
    }).options({ stripUnknown: true });

  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }
}