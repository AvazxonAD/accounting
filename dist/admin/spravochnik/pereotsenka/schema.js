"use strict";

var Joi = require('joi');
exports.createPereotsenkaSchema = Joi.object({
  body: Joi.object({
    data: Joi.array().items(Joi.object({
      group_jur7_id: Joi.number().min(1).integer().required(),
      name: Joi.string().trim().required(),
      pereotsenka_foiz: Joi.number().precision(2).required()
    }))
  })
}).options({
  stripUnknown: true
});
exports.updatePereotsenkaSchema = Joi.object({
  body: Joi.object({
    group_jur7_id: Joi.number().min(1).integer().required(),
    name: Joi.string().trim(),
    pereotsenka_foiz: Joi.number()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
});
exports.getPereotsenkaSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    search: Joi.string().trim()
  })
}).options({
  stripUnknown: true
});
exports.getByIdPereotsenkaSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.deletePereotsenkaSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});