const Joi = require('joi');

exports.getByTovarIdSchema = Joi.object({
    query: Joi.object({
      tovar_id: Joi.number().integer().min(1).required()
    })
  }).options({ stripUnknown: true });
  