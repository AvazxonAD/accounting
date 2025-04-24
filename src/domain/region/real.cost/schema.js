const Joi = require("joi");

exports.OdinoxSchema = class {
  static update() {
    return Joi.object({
      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        childs: Joi.array()
          .items(
            Joi.object({
              type_id: Joi.number().integer().min(1).required(),
              sub_childs: Joi.array()
                .items(
                  Joi.object({
                    id: Joi.number().integer().allow(null),
                    smeta_id: Joi.number().integer().min(1).required(),
                    summa: Joi.number().required(),
                  })
                )
                .min(1)
                .required(),
            })
          )
          .min(1)
          .required(),
      }),

      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),

      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().min(1).integer().default(1),
        year: Joi.number().min(1).integer().min(1901).max(2099),
        main_schet_id: Joi.number().min(1).integer().required(),
        limit: Joi.number().min(1).integer().default(10),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),

      query: Joi.object({
        report_title_id: Joi.number().min(1).integer(),
        main_schet_id: Joi.number().min(1).integer().required(),
        excel: Joi.string().valid("true", "false"),
      }),
    }).options({ stripUnknown: true });
  }

  static create() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
      }),

      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        childs: Joi.array()
          .items(
            Joi.object({
              type_id: Joi.number().integer().min(1).required(),
              sub_childs: Joi.array()
                .items(
                  Joi.object({
                    smeta_id: Joi.number().integer().required().min(1),
                    summa: Joi.number().required(),
                  })
                )
                .min(1)
                .required(),
            })
          )
          .min(1)
          .required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getSmeta() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
        year: Joi.number().integer().required().min(1901).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getData() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
        month: Joi.number().min(1).integer().max(12).required(),
        year: Joi.number().min(1901).integer().max(2099).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
