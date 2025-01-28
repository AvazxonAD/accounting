const Joi = require('joi');


exports.Schema = class {
  static getObrotkaSchema() {
    return Joi.object({
      query: Joi.object({
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1900).required(),
        main_schet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }

  static getMaterialSchema() {
    return Joi.object({
      query: Joi.object({
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1900).required(),
        main_schet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }

  static capSchema() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        excel: Joi.string().trim().valid('true', 'false')
      })
    }).options({ stripUnknown: true });
  }

  static backCapSchema() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        excel: Joi.string().trim().valid('true', 'false')
      })
    }).options({ stripUnknown: true });
  }

  static getSaldoSchema() {
    return Joi.object({
      query: Joi.object({
        responsible_id: Joi.number().integer().min(1).required(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        product_id: Joi.number().integer().min(1)
      })
    }).options({ stripUnknown: true });
  }
}