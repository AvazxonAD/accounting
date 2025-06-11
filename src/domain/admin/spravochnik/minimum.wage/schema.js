const Joi = require("joi");

exports.MinimumWageSchema = class {
  static update() {
    return Joi.object({
      body: Joi.object({
        summa: Joi.number().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({}).options({ stripUnknown: true });
  }
};
