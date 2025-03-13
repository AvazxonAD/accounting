"use strict";

var Joi = require('joi');
exports.createSchema = Joi.object({
  body: Joi.object({
    smeta_name: Joi.string().trim().required(),
    smeta_number: Joi.string().trim().required(),
    father_smeta_name: Joi.string().trim().required(),
    group_number: Joi.string().trim().required()
  })
}).options({
  stripUnknown: true
});
exports.updateSchema = Joi.object({
  body: Joi.object({
    smeta_name: Joi.string().trim().required(),
    smeta_number: Joi.string().trim().required(),
    father_smeta_name: Joi.string().trim().required(),
    group_number: Joi.string().trim().required()
  }),
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1)
  })
}).options({
  stripUnknown: true
});
exports.getSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1)["default"](1),
    limit: Joi.number().min(1).integer()["default"](10),
    search: Joi.string().trim().allow(null, ''),
    budjet_id: Joi.number().min(1).integer(),
    group_number: Joi.string().trim()
  })
}).options({
  stripUnknown: true
});
exports.getByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1)
  })
});
exports.deleteSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1)
  })
});