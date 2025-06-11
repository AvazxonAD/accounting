const Joi = require("joi");

exports.ConstanstsSchema = class {
  static docNum() {
    return Joi.object({
      params: Joi.object({
        page: Joi.string()
          .trim()
          .pattern(/^[a-zA-Z0-9_]+$/)
          .required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static checkSchets() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getDistricts() {
    return Joi.object({
      query: Joi.object({
        region_id: Joi.number().integer().min(1),
      }),
    }).options({ stripUnknown: true });
  }
};
