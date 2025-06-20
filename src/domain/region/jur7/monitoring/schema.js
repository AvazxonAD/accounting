const Joi = require("joi");

exports.Schema = class {
  static monitoring() {
    return Joi.object({
      query: Joi.object({
        order_by: Joi.string().trim().default("doc_date").valid("doc_num", "doc_date", "id"),
        order_type: Joi.string().trim().allow(null, "").default("DESC").valid("ASC", "DESC"),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        main_schet_id: Joi.number().min(1).integer(),
        budjet_id: Joi.number().min(1).integer(),
        search: Joi.string().trim().allow(null, ""),
        page: Joi.number().min(1).integer().default(1),
        limit: Joi.number().min(1).integer().default(10),
      }),
    }).options({ stripUnknown: true });
  }

  static daysReport() {
    return Joi.object({
      query: Joi.object({
        order_by: Joi.string().trim().default("doc_date").valid("doc_num", "doc_date", "id"),
        order_type: Joi.string().trim().allow(null, "").default("DESC").valid("ASC", "DESC"),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        main_schet_id: Joi.number().min(1).integer(),
        budjet_id: Joi.number().min(1).integer(),
        search: Joi.string().trim().allow(null, ""),
        page: Joi.number().min(1).integer().default(1),
        excel: Joi.string().trim().valid("true", "false"),
        limit: Joi.number().min(1).integer().default(10),
      }),
    }).options({ stripUnknown: true });
  }

  static reportBySchets() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().min(1).integer(),
        main_schet_id: Joi.number().min(1).integer(),
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1901).required(),
        excel: Joi.string().trim().valid("true", "false"),
        is_year: Joi.string().trim().valid("true", "false"),
      }),
    }).options({ stripUnknown: true });
  }

  static getMaterialSchema() {
    return Joi.object({
      query: Joi.object({
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1901).required(),
        to: Joi.string()
          .required()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        excel: Joi.string().trim().valid("true", "false"),
        iznos: Joi.string().trim().valid("true", "false"),
        budjet_id: Joi.number().min(1).integer(),
        main_schet_id: Joi.number().integer().min(1).required(),
        responsible_id: Joi.number().integer().min(1),
      }),
    }).options({ stripUnknown: true });
  }

  static act() {
    return Joi.object({
      query: Joi.object({
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1901).required(),
        excel: Joi.string().trim().valid("true", "false"),
        title: Joi.string().trim().required(),
        comment: Joi.string().trim().required(),
        iznos: Joi.string().trim().valid("true", "false"),
        budjet_id: Joi.number().min(1).integer(),
        main_schet_id: Joi.number().integer().min(1).required(),
        responsible_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static capSchema() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
        report_title_id: Joi.number().integer().min(1).required(),
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1901).required(),
        excel: Joi.string().trim().valid("true", "false"),
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

  static reportBySchetsData() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
        report_title_id: Joi.number().integer().min(1).required(),
        month: Joi.number().integer().min(1).required().max(12),
        year: Joi.number().integer().min(1901).required(),
        excel: Joi.string().trim().valid("true", "false"),
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

  static getSaldoDate() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
        year: Joi.number().integer().min(1901).required(),
      }),
    }).options({ stripUnknown: true });
  }
};
