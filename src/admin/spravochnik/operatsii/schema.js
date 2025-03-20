const Joi = require("joi");

exports.OperatsiiSchema = class {
  static getUniqueSchets(lang) {
    return Joi.object({
      query: Joi.object({
        type_schet: Joi.string().trim(),
        budjet_id: Joi.number().min(1).integer(),
      }),
    });
  }
};
