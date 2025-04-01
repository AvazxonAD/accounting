const Joi = require("joi");

exports.PrixodSchetsSchema = class {
  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static create() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().required(),
        schet: Joi.string().trim().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().required(),
        schet: Joi.string().trim().required(),
      }),
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        search: Joi.string().trim(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }
};
