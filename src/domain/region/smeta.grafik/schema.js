const Joi = require("joi");

exports.SmetaGrafikSchema = class {
  static getOld() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().min(1).integer().default(10),
        year: Joi.number().integer().min(1901),
      }),
    }).options({ stripUnknown: true });
  }

  static multiInsert() {
    return Joi.object({
      body: Joi.object({
        smetas: Joi.array()
          .min(1)
          .required()
          .items(
            Joi.object({
              smeta_id: Joi.number().required().required(),
              oy_1: Joi.number().required(),
              oy_2: Joi.number().required(),
              oy_3: Joi.number().required(),
              oy_4: Joi.number().required(),
              oy_5: Joi.number().required(),
              oy_6: Joi.number().required(),
              oy_7: Joi.number().required(),
              oy_8: Joi.number().required(),
              oy_9: Joi.number().required(),
              oy_10: Joi.number().required(),
              oy_11: Joi.number().required(),
              oy_12: Joi.number().required(),
            })
          ),
      }),

      query: Joi.object({
        main_schet_id: Joi.number().required().required(),
        year: Joi.number().required().required(),
      }),
    }).options({ stripUnknown: true });
  }
};

exports.createSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().required().required(),
    spravochnik_budjet_name_id: Joi.number().required().required(),
    main_schet_id: Joi.number().required().min(1900),
    year: Joi.number().required().required(),
    oy_1: Joi.number().required(),
    oy_2: Joi.number().required(),
    oy_3: Joi.number().required(),
    oy_4: Joi.number().required(),
    oy_5: Joi.number().required(),
    oy_6: Joi.number().required(),
    oy_7: Joi.number().required(),
    oy_8: Joi.number().required(),
    oy_9: Joi.number().required(),
    oy_10: Joi.number().required(),
    oy_11: Joi.number().required(),
    oy_12: Joi.number().required(),
  }),
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().required().required(),
    spravochnik_budjet_name_id: Joi.number().required().required(),
    main_schet_id: Joi.number().required().required(),
    year: Joi.number().required().min(1900),
    oy_1: Joi.number().required(),
    oy_2: Joi.number().required(),
    oy_3: Joi.number().required(),
    oy_4: Joi.number().required(),
    oy_5: Joi.number().required(),
    oy_6: Joi.number().required(),
    oy_7: Joi.number().required(),
    oy_8: Joi.number().required(),
    oy_9: Joi.number().required(),
    oy_10: Joi.number().required(),
    oy_11: Joi.number().required(),
    oy_12: Joi.number().required(),
  }),
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1),
  }),
}).options({ stripUnknown: true });

exports.getSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().min(1).integer().default(10),
    search: Joi.string().trim().allow(null, ""),
    type: Joi.string().trim(),
    group_number: Joi.string().trim(),
    operator: Joi.string().trim().valid("=", ">"),
    main_schet_id: Joi.number().min(1).integer().required(),
    year: Joi.number().integer().min(1901),
  }),
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1),
  }),

  query: Joi.object({
    main_schet_id: Joi.number().min(1).integer().required(),
  }),
});

exports.deleteSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1),
  }),

  query: Joi.object({
    main_schet_id: Joi.number().min(1).integer().required(),
  }),
});
