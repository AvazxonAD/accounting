const Joi = require("joi");

exports.Schema = class {
  static getMaterialSchema() {
    return Joi.object({
      query: Joi.object({
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1901).required(),
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static capSchema() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        report_title_id: Joi.number().integer().min(1).required(),
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1901).required(),
        excel: Joi.string().trim().valid("true", "false"),
      }),
    }).options({ stripUnknown: true });
  }
};
