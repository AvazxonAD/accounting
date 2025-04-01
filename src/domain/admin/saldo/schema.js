const Joi = require('joi')

exports.SaldoSchema = class {
  static get() {
    return Joi.object({
      query: Joi.object({
        kimning_buynida: Joi.number().integer().min(1),
        region_id: Joi.number().integer().min(1),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(99999),
        search: Joi.string().trim().allow(null, ''),
        responsible: Joi.string().trim().valid('true', 'false').default('true'),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
      })
    }).options({ stripUnknown: true })
  }
}