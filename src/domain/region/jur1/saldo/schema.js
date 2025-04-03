const Joi = require("joi");

exports.KassaSaldoSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        summa: Joi.number().required(),
        main_schet_id: Joi.number().required().min(1),
      }),

      query: Joi.object({
        budjet_id: Joi.number().required().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }

  static createAuto() {
    return Joi.object({
      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        main_schet_id: Joi.number().required().min(1),
      }),

      query: Joi.object({
        budjet_id: Joi.number().required().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().required().min(1).integer(),
        year: Joi.number().integer().min(1901),
        month: Joi.number().integer().min(1).max(12),
      }),
    }).options({ stripUnknown: true });
  }

  static getDateSaldo() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }

  static getByMonth() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer(),
        year: Joi.number().integer().min(1901),
        month: Joi.number().integer().min(1).max(12).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().required().min(1),
      }),

      query: Joi.object({
        budjet_id: Joi.number().required().min(1).integer(),
      }),
    });
  }

  static delete() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().required().integer().min(1),
        main_schet_id: Joi.number().required().integer().min(1),
      }),

      params: Joi.object({
        id: Joi.number().required().min(1),
      }),
    });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        summa: Joi.number().required(),
        main_schet_id: Joi.number().required().min(1),
      }),

      params: Joi.object({
        id: Joi.number().required().min(1),
      }),

      query: Joi.object({
        budjet_id: Joi.number().required().min(1).integer(),
      }),
    }).options({ stripUnknown: true });
  }
};
