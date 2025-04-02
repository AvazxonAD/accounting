const Joi = require("joi");

exports.monitoringSchema = Joi.object({
  query: Joi.object({
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
    operatsii: Joi.string().trim().required(),
    podotchet_id: Joi.number().min(1).integer(),
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
    main_schet_id: Joi.number().integer().required().min(1),
    budjet_id: Joi.number().integer().required().min(1),
    operatsii: Joi.string().trim().required(),
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
    operatsii: Joi.string().trim().required(),
    to: Joi.string()
      .trim()
      .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    excel: Joi.string().trim().default("false").valid("true", "false"),
  }),
}).options({ stripUnknown: true });

exports.getByIdPodotchetToExcelSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().integer().required().min(1),
    operatsii: Joi.string().trim().required(),
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
