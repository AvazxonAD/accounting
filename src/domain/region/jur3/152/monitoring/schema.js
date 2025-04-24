const Joi = require("joi");

exports.Monitoring159Schema = class {
  static aktSverka() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer(),
        budjet_id: Joi.number().required().min(1).integer(),
        report_title_id: Joi.number().required().min(1).integer(),
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        schet_id: Joi.number().min(1).integer().required(),
        excel: Joi.string()
          .trim()
          .pattern(/^(true|false)$/)
          .allow("", null),
      }),
    }).options({ stripUnknown: true });
  }

  static daysReport() {
    return Joi.object({
      query: Joi.object({
        report_title_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().integer().required().min(1),
        schet_id: Joi.number().integer().required().min(1),
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
        main_schet_id: Joi.number().required().min(1).integer(),
        budjet_id: Joi.number().required().min(1).integer(),
        report_title_id: Joi.number().required().min(1).integer(),
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        schet_id: Joi.number().min(1).integer().required(),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        search: Joi.string().trim().allow(null, ""),
        excel: Joi.string()
          .trim()
          .pattern(/^(true|false)$/)
          .allow("", null),
        organ_id: Joi.number().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }
};

exports.monitoringSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().required().min(1).integer(),
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
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
    search: Joi.string().trim().allow(null, ""),
    organ_id: Joi.number().min(1).integer(),
    schet_id: Joi.number().min(1).integer().required(),
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

exports.aktSverkaSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().required().min(1),
    contract_id: Joi.number().min(1),
    schet: Joi.string().required().trim(),
    month: Joi.number().integer().required().min(1).max(12).required(),
    year: Joi.number().integer().required().min(1901).required(),
    schet_id: Joi.number().min(1).integer().required(),
    to: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    from: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    organ_id: Joi.number().min(1),
  }),
}).options({ stripUnknown: true });

exports.prixodRasxodSchema = Joi.object({
  query: Joi.object({
    to: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    budjet_id: Joi.number().integer().min(1).required(),
    excel: Joi.string()
      .trim()
      .pattern(/^(true|false)$/)
      .allow("", null),
    schet_id: Joi.number().min(1).integer().required(),
    main_schet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().required().min(1).max(12).required(),
    year: Joi.number().integer().required().min(1901).required(),
  }),
}).options({ stripUnknown: true });

exports.capSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().required().min(1).max(12).required(),
    year: Joi.number().integer().required().min(1901).required(),
    to: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    from: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    excel: Joi.string()
      .trim()
      .pattern(/^(true|false)$/)
      .allow("", null),
    main_schet_id: Joi.number().integer().min(1).required(),
    report_title_id: Joi.number().integer().min(1).required(),
    schet_id: Joi.number().min(1).integer().required(),
    budjet_id: Joi.number().integer().min(1).required(),
  }),
}).options({ stripUnknown: true });

exports.consolidatedSchema = Joi.object({
  query: Joi.object({
    schet: Joi.string().required().trim(),
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
    schet: Joi.string().trim().required(),
    schet_id: Joi.number().min(1).integer().required(),
    excel: Joi.string()
      .trim()
      .pattern(/^(true|false)$/)
      .allow("", null),
    main_schet_id: Joi.number().integer().min(1).required(),
    contract: Joi.string()
      .trim()
      .pattern(/^(true|false)$/)
      .allow("", null),
    organ_id: Joi.number().integer().min(1),
  }),
}).options({ stripUnknown: true });
