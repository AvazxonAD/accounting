const Joi = require("joi");

exports.KassaRasxodSchema = class {
  static get() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        search: Joi.string().trim(),
      }),
    }).options({ stripUnknown: true });
  }

  static cap() {
    return Joi.object({
      query: Joi.object({
        report_title_id: Joi.number().integer().required().min(1),
        main_schet_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().integer().required().min(1),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        excel: Joi.string().trim(),
      }),
    }).options({ stripUnknown: true });
  }

  static daily() {
    return Joi.object({
      query: Joi.object({
        report_title_id: Joi.number().integer().required().min(1),
        main_schet_id: Joi.number().integer().required().min(1),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
      }),
    }).options({ stripUnknown: true });
  }
};
