const Joi = require("joi");

exports.VideoModuleSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().required(),
        status: Joi.boolean().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().required(),
        status: Joi.boolean().required(),
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
        limit: Joi.number().min(1).integer().default(100),
        search: Joi.string().trim(),
        status: Joi.string().valid("true", "false"),
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

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
