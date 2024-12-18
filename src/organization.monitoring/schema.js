const Joi = require('joi')

exports.getMonitoringSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().required().min(1).integer(),
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    operatsii: Joi.string().required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
  })
}).options({ stripUnknown: true });

exports.getByOrganizationIdMonitoringSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().required().min(1).integer(),
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    operatsii: Joi.string().required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    organ_id: Joi.number().required().min(1).integer()
  })
}).options({ stripUnknown: true });

exports.aktSverkaSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().required().min(1),
    contract_id: Joi.number().min(1),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    organ_id: Joi.number().min(1),
  })
}).options({ stripUnknown: true });

exports.prixodRasxodOrganizationSchema = Joi.object({
  query: Joi.object({
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    operatsii: Joi.string().trim().required(),
    main_schet_id: Joi.number().min(1).required()
  })
}).options({ stripUnknown: true });

exports.orderOrganizationSchema = Joi.object({
  query: Joi.object({
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    main_schet_id: Joi.number().min(1).required()
  })
}).options({ stripUnknown: true });