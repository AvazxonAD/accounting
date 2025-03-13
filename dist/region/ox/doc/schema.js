"use strict";

var Joi = require('joi');
exports.createDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    childs: Joi.array().required().items(Joi.object({
      smeta_grafik_id: Joi.number().required().min(1),
      tulangan_mablag_smeta_buyicha: Joi.number().required().min(1),
      kassa_rasxod: Joi.number().required().min(1),
      haqiqatda_harajatlar: Joi.number().required().min(1)
    }))
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.updateDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    childs: Joi.array().required().items(Joi.object({
      smeta_grafik_id: Joi.number().required().min(1),
      tulangan_mablag_smeta_buyicha: Joi.number().required().min(1),
      kassa_rasxod: Joi.number().required().min(1),
      haqiqatda_harajatlar: Joi.number().required().min(1)
    }))
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.getDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1),
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(1901)
  })
}).options({
  stripUnknown: true
});
exports.getByIdDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required()
  })
}).options({
  stripUnknown: true
});
exports.deleteDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required()
  })
}).options({
  stripUnknown: true
});