const Joi = require('joi');

exports.getIznosSchema = Joi.object({
  query: Joi.object({
    product_id: Joi.number().integer().min(1),
    responsible_id: Joi.number().integer().min(1),
    search: Joi.string().trim().allow(null, ''),
    year: Joi.number().integer().min(1900),
    month: Joi.number().integer().min(1).max(12),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10)
  })
}).options({ stripUnknown: true });

exports.updateIznosSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  }),
  body: Joi.object({
    iznos_start_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    eski_iznos_summa: Joi.number().integer().min(0).required()
  })
}).options({ stripUnknown: true });
