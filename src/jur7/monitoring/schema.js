const Joi = require('joi');

exports.getObrotkaSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().min(1).required().max(12),
    year: Joi.number().integer().min(1900).required(),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getMaterialSchema = Joi.object({
  query: Joi.object({
    month: Joi.number().integer().min(1).required().max(12),
    year: Joi.number().integer().min(1900).required(),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.capSchema = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
  })
}).options({ stripUnknown: true });