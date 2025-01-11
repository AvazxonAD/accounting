const Joi = require('joi');

exports.getByTovarIdSchema = Joi.object({
    query: Joi.object({
      product_id: Joi.number().integer().min(1),
      responsible_id: Joi.number().integer().min(1)
    })
  }).options({ stripUnknown: true });
  