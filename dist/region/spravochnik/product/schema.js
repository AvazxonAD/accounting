"use strict";

var Joi = require('joi');
exports.createNaimenovanieSchema = Joi.object({
  body: Joi.object({
    spravochnik_budjet_name_id: Joi.number().required(),
    name: Joi.string().trim(),
    edin: Joi.string().trim(),
    group_jur7_id: Joi.number().required(),
    inventar_num: Joi.string().trim(),
    serial_num: Joi.string().trim()
  })
}).options({
  stripUnknown: true
});
exports.updateNaimenovanieSchema = Joi.object({
  body: Joi.object({
    spravochnik_budjet_name_id: Joi.number().required(),
    name: Joi.string().trim(),
    edin: Joi.string().trim(),
    group_jur7_id: Joi.number().required(),
    inventar_num: Joi.string().trim(),
    serial_num: Joi.string().trim()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
});
exports.getNaimenovanieSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1)["default"](1),
    limit: Joi.number().integer().min(1)["default"](10),
    search: Joi.string().trim()
  })
}).options({
  stripUnknown: true
});
exports.getByIdNaimenovanieSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.deleteNaimenovanieSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.getProductKolSchema = Joi.object({
  query: Joi.object({
    kimdan_id: Joi.number().integer().min(1).required(),
    search: Joi.string().trim()
  })
}).options({
  stripUnknown: true
});