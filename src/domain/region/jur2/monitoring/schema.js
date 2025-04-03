const Joi = require("joi");

exports.BankMonitoringSchema = class {
  static get() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        search: Joi.string().trim().allow(null, ""),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        order_by: Joi.string()
          .trim()
          .default("doc_date")
          .valid("doc_num", "doc_date", "id"),
        order_type: Joi.string()
          .trim()
          .allow(null, "")
          .default("DESC")
          .valid("ASC", "DESC"),
      }),
    }).options({ stripUnknown: true });
  }

  static cap() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().integer().required().min(1),
        report_title_id: Joi.number().integer().required().min(1),
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
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

  static daysReport() {
    return Joi.object({
      query: Joi.object({
        report_title_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().integer().required().min(1),
        excel: Joi.boolean().default(false),
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
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

  static prixodReport() {
    return Joi.object({
      query: Joi.object({
        report_title_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().integer().required().min(1),
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        excel: Joi.boolean().default(false),
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
