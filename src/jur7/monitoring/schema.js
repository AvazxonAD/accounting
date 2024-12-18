const Joi = require('joi');

exports.getObrotkaSchema = Joi.object({
    query: Joi.object({
      month: Joi.number().integer().min(1).required().max(12),
      year: Joi.number().integer().min(1900).required(),
      main_schet_id: Joi.number().integer().min(1).required()
    })
  }).options({ stripUnknown: true });
  