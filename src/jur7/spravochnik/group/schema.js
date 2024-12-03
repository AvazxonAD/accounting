const Joi = require('joi');

exports.createGroupSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().min(1).integer().required(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    group_number: Joi.string().trim(),
    provodka_kredit: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.updateGroupSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().required().min(1).integer(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    group_number: Joi.string().trim(),
    provodka_kredit: Joi.string().trim()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
});

exports.getGroupSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.getByIdGroupSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteGroupSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });
