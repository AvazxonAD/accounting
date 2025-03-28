const Joi = require("joi");

exports.GeneralSchema = class {
  static getVideoWatch() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
