const Joi = require("joi");

exports.VideoSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().required(),
        module_id: Joi.number().integer().required().min(1),
        sort_order: Joi.number().integer().required().min(1),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().required(),
        module_id: Joi.number().integer().required().min(1),
        sort_order: Joi.number().integer().required().min(1),
      }),

      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().min(1).integer().default(1),
        limit: Joi.number().min(1).integer().default(10),
        module_id: Joi.number().min(1).integer(),
        search: Joi.string().trim(),
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

  static getWatch() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
