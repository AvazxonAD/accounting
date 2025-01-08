const Joi = require('joi')

exports.monitoringSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().required().min(1).integer(),
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    operatsii: Joi.string().required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    organ_id: Joi.number().min(1).integer()
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

exports.prixodRasxodSchema = Joi.object({
  query: Joi.object({
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    operatsii: Joi.string().trim().required(),
    budjet_id: Joi.number().integer().min(1).required(),
    excel: Joi.string().trim().pattern(/^(true|false)$/).allow('', null),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.capSchema = Joi.object({
  query: Joi.object({
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    operatsii: Joi.string().trim().required(),
    excel: Joi.string().trim().pattern(/^(true|false)$/).allow('', null),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.consolidatedSchema = Joi.object({
  query: Joi.object({
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    schet: Joi.string().trim().required(),
    excel: Joi.string().trim().pattern(/^(true|false)$/).allow('', null),
    main_schet_id: Joi.number().integer().min(1).required(),
    contract: Joi.string().trim().pattern(/^(true|false)$/).allow('', null),
  })
}).options({ stripUnknown: true });

exports.orderOrganizationSchema = Joi.object({
  query: Joi.object({
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    main_schet_id: Joi.number().min(1).required(),
    schet: Joi.string().trim()
  })
}).options({ stripUnknown: true });