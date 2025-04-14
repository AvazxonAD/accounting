const Joi = require("joi");

exports.Saldo152Schema = class {
  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().required().min(1),
      }),

      query: Joi.object({
        budjet_id: Joi.number().required().min(1).integer(),
        main_schet_id: Joi.number().required().min(1).integer(),
        schet_id: Joi.number().required().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }

  static getData() {
    return Joi.object({
      query: Joi.object({
        first: Joi.string().valid("true", "false").required(),
        budjet_id: Joi.number().required().min(1).integer(),
        main_schet_id: Joi.number().min(1).integer(),
        schet_id: Joi.number().min(1).integer(),
        year: Joi.number().integer().min(1901),
        month: Joi.number().integer().min(1).max(12),
      }),
    });
  }

  static create() {
    return Joi.object({
      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        organizations: Joi.array()
          .min(1)
          .required()
          .items(
            Joi.object({
              organization_id: Joi.number().min(1).integer().required(),
              prixod: Joi.number().min(0).required(),
              rasxod: Joi.number().min(0).required(),
            })
          ),
      }),

      query: Joi.object({
        schet_id: Joi.number().integer().required().min(1),
        main_schet_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().required().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().required().min(1).integer(),
        main_schet_id: Joi.number().min(1).integer(),
        schet_id: Joi.number().min(1).integer(),
        year: Joi.number().integer().min(1901),
        month: Joi.number().integer().min(1).max(12),
      }),
    }).options({ stripUnknown: true });
  }

  static getFirstSaldo() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer(),
        schet_id: Joi.number().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }

  static cleanData() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().integer().required().min(1),
        schet_id: Joi.number().integer().required().min(1),
        password: Joi.string().trim().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().required().min(1),
        main_schet_id: Joi.number().integer().required().min(1),
        schet_id: Joi.number().integer().required().min(1),
      }),

      params: Joi.object({
        id: Joi.number().required().min(1),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        organizations: Joi.array()
          .min(1)
          .required()
          .items(
            Joi.object({
              organization_id: Joi.number().min(1).integer().required(),
              prixod: Joi.number().min(0).required(),
              rasxod: Joi.number().min(0).required(),
            })
          ),
      }),

      params: Joi.object({
        id: Joi.number().required().min(1),
      }),

      query: Joi.object({
        main_schet_id: Joi.number().integer().required().min(1),
        schet_id: Joi.number().integer().required().min(1),
        budjet_id: Joi.number().required().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }
};
