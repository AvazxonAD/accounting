"use strict";

var Joi = require('joi');
exports.getSchema = Joi.object({
  query: Joi.object({
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
  })
}).options({
  stripUnknown: true
});
exports.getUserSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});