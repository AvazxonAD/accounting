const Joi = require('joi');

exports.getByTovarIdSchema = Joi.object({
    query: Joi.object({
      product_id: Joi.number().integer().min(1),
      responsible_id: Joi.number().integer().min(1),
      search: Joi.string().trim().allow(null, ''),
      year: Joi.number().integer().min(1900),
      month: Joi.number().integer().min(1).max(12)
    })
  }).options({ stripUnknown: true });
  