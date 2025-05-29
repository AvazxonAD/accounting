const Joi = require("joi");

exports.PodotchetMonitoringSchema = class {
  static reportBySchets() {
    return Joi.object({
      query: Joi.object({
        schet_id: Joi.number().min(1).integer().required(),
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        main_schet_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().integer().required().min(1),
        report_title_id: Joi.number().integer().required().min(1),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        excel: Joi.string().trim().default("false").valid("true", "false"),
      }),
    }).options({ stripUnknown: true });
  }

  static daysReport() {
    return Joi.object({
      query: Joi.object({
        report_title_id: Joi.number().integer().required().min(1),
        main_schet_id: Joi.number().integer().required().min(1),
        podotchet_id: Joi.number().integer().min(1),
        schet_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().integer().required().min(1),
        excel: Joi.boolean().default(false),
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

exports.monitoringSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().required().min(1).max(12).required(),
    year: Joi.number().integer().required().min(1901).required(),
    main_schet_id: Joi.number().integer().required().min(1),
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
    search: Joi.string().trim().allow(null, ""),
    schet_id: Joi.number().min(1).integer().required(),
    podotchet_id: Joi.number().min(1).integer(),
    month: Joi.number().integer().required().min(1).max(12).required(),
    year: Joi.number().integer().required().min(1901).required(),
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
  params: Joi.object({
    id: Joi.number().integer().min(1),
  }),
}).options({ stripUnknown: true });

exports.capSchema = Joi.object({
  query: Joi.object({
    schet_id: Joi.number().min(1).integer().required(),
    month: Joi.number().integer().required().min(1).max(12).required(),
    year: Joi.number().integer().required().min(1901).required(),
    main_schet_id: Joi.number().integer().required().min(1),
    budjet_id: Joi.number().integer().required().min(1),
    report_title_id: Joi.number().integer().required().min(1),
    from: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    to: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    excel: Joi.string().trim().default("false").valid("true", "false"),
  }),
}).options({ stripUnknown: true });

exports.prixodRasxodSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().required().min(1),
    schet_id: Joi.number().min(1).integer().required(),
    main_schet_id: Joi.number().min(1).integer().required(),
    to: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    excel: Joi.string().trim().default("false").valid("true", "false"),
  }),
}).options({ stripUnknown: true });

exports.getByIdPodotchetToExcelSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().required().min(1).max(12).required(),
    year: Joi.number().integer().required().min(1901).required(),
    main_schet_id: Joi.number().integer().required().min(1),
    schet_id: Joi.number().min(1).integer().required(),
    from: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    to: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1),
  }),
}).options({ stripUnknown: true });
