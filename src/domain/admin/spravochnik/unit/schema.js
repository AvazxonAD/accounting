const Joi = require("joi");

exports.createSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim(),
  }),
}).options({ stripUnknown: true });

exports.updateUnitSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim(),
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
});

exports.getByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
}).options({ stripUnknown: true });

exports.deleteUnitSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
}).options({ stripUnknown: true });

exports.getUnitSchema = Joi.object({
  query: Joi.object({
    search: Joi.string().trim().allow(""),
  }),
}).options({ stripUnknown: true });
