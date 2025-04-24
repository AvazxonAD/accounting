const Joi = require("joi");

exports.updateAccessSchema = Joi.object({
  body: Joi.object({
    kassa: Joi.boolean().default(false),
    bank: Joi.boolean().default(false),
    jur3: Joi.boolean().default(false),
    jur4: Joi.boolean().default(false),
    jur5: Joi.boolean().default(false),
    jur7: Joi.boolean().default(false),
    jur8: Joi.boolean().default(false),
    spravochnik: Joi.boolean().default(false),
    region: Joi.boolean().default(false),
    main_book: Joi.boolean().default(false),
    smeta_grafik: Joi.boolean().default(false),
    odinox: Joi.boolean().default(false),
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
}).options({ stripUnknown: true });

exports.getByRoleIdAccessSchema = Joi.object({
  query: Joi.object({
    role_id: Joi.number().integer().min(1).required(),
  }),
}).options({ stripUnknown: true });
