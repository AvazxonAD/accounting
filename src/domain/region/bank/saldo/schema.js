const Joi = require("joi");

exports.BankSaldoSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        opisanie: Joi.string().trim(),
        prixod: Joi.boolean().required(),
        rasxod: Joi.boolean().required(),
        childs: Joi.array()
          .items(
            Joi.object({
              operatsii_id: Joi.number().required(),
              summa: Joi.number().required(),
              podraz_id: Joi.number().integer().min(1).allow(null),
              sostav_id: Joi.number().integer().min(1).allow(null),
              type_operatsii_id: Joi.number().integer().min(1).allow(null),
            })
          )
          .min(1),
      }),

      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
        limit: Joi.number().min(1).default(10),
        search: Joi.string().trim().allow(null, ""),
        page: Joi.number().min(1).default(1),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
      }),
      params: Joi.object({
        id: Joi.number().required().min(1),
      }),
    });
  }

  static delete() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
      }),
      params: Joi.object({
        id: Joi.number().required().min(1),
      }),
    });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        opisanie: Joi.string().trim(),
        prixod: Joi.boolean().required(),
        rasxod: Joi.boolean().required(),
        childs: Joi.array()
          .items(
            Joi.object({
              id: Joi.number().integer().min(1),
              operatsii_id: Joi.number().required(),
              summa: Joi.number().required(),
              podraz_id: Joi.number().integer().min(1).allow(null),
              sostav_id: Joi.number().integer().min(1).allow(null),
              type_operatsii_id: Joi.number().integer().min(1).allow(null),
            })
          )
          .min(1),
      }),

      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
      }),
      params: Joi.object({
        id: Joi.number().required().min(1),
      }),
    }).options({ stripUnknown: true });
  }
};
