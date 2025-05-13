const Joi = require("joi");

exports.SmetaGrafikSchema = class {
  static getByOrderNumber() {
    return Joi.object({
      query: Joi.object({
        year: Joi.number().integer().min(1901),
        main_schet_id: Joi.number().required().integer().min(1),
        order_number: Joi.number().required().integer().min(0),
      }),
    }).options({ stripUnknown: true });
  }

  static create() {
    return Joi.object({
      body: Joi.object({
        command: Joi.string().trim().required(),
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

  static update() {
    return Joi.object({
      body: Joi.object({
        command: Joi.string().trim().required(),
        smetas: Joi.array()
          .min(1)
          .required()
          .items(
            Joi.object({
              id: Joi.number().min(1).integer(),
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
      }),

      params: Joi.object({
        id: Joi.number().required().required().integer().min(1),
      }),
    }).options({ stripUnknown: true });
  }
};

exports.getSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().min(1).integer().default(10),
    main_schet_id: Joi.number().min(1).integer().required(),
    year: Joi.number().integer().min(1901).required(),
  }),
}).options({ stripUnknown: true });

exports.getByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1),
  }),

  query: Joi.object({
    main_schet_id: Joi.number().min(1).integer().required(),
    excel: Joi.string().trim().default("false"),
    year: Joi.number().integer().min(1901).required(),
  }),
}).options({ stripUnknown: true });

exports.deleteSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().required().integer().min(1),
  }),

  query: Joi.object({
    main_schet_id: Joi.number().min(1).integer().required(),
  }),
}).options({ stripUnknown: true });
