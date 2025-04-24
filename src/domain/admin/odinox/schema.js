const Joi = require("joi");

exports.MainBookSchema = class {
  static update() {
    return Joi.object({
      body: Joi.object({
        status: Joi.number().integer().required().valid(2, 3),
      }),

      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        year: Joi.number().min(1).integer().min(1901).max(2099),
        month: Joi.number().min(1).integer().min(1).max(12),
        main_schet_id: Joi.number().min(1).integer(),
        page: Joi.number().min(1).integer().default(1),
        limit: Joi.number().min(1).integer().default(10),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
