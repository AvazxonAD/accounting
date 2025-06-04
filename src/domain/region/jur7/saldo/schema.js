const Joi = require("joi");
const { query } = require("winston");

exports.SaldoSchema = class {
  static import() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
      file: Joi.object({
        path: Joi.string().trim().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static importData(lang) {
    return Joi.object({
      responsible_id: Joi.number()
        .min(1)
        .required()
        .integer()
        .max(2147483647)
        .messages({ "*": lang.t("validation.responsibleId") }),
      group_jur7_id: Joi.number()
        .required()
        .messages({ "*": lang.t("validation.groupId") }),
      doc_date: Joi.date()
        .optional()
        .allow(null)
        .messages({
          "*": lang.t("validation.importDocDate"),
        }),
      iznos_start: Joi.string()
        .trim()
        .pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/)
        .messages({ "*": lang.t("validation.iznosStart") }),
      doc_num: Joi.string()
        .allow(null, "")
        .messages({ "*": lang.t("validation.docNum") }),
      name: Joi.string()
        .trim()
        .required()
        .messages({ "*": lang.t("validation.productName") }),
      edin: Joi.string()
        .trim()
        .required()
        .messages({ "*": lang.t("validation.edin") }),
      kol: Joi.number()
        .greater(0)
        .required()
        .messages({ "*": lang.t("validation.kol") }),
      summa: Joi.number()
        .min(0)
        .required()
        .messages({ "*": lang.t("validation.summa") }),
      year: Joi.number()
        .min(1901)
        .required()
        .messages({ "*": lang.t("validation.year") }),
      month: Joi.number()
        .min(1)
        .max(12)
        .required()
        .messages({ "*": lang.t("validation.month") }),
      inventar_num: Joi.any().messages({
        "*": lang.t("validation.inventarNum"),
      }),
      serial_num: Joi.any().messages({ "*": lang.t("validation.serialNum") }),
      iznos: Joi.any().messages({ "*": lang.t("validation.iznos") }),
      eski_iznos_summa: Joi.number()
        .min(0)
        .default(0)
        .messages({ "*": lang.t("validation.eskiIznosSumma") }),
    }).options({ stripUnknown: true });
  }

  static createByGroup() {
    return Joi.object({
      body: Joi.object({
        data: Joi.array()
          .required()
          .min(1)
          .items(
            Joi.object({
              responsible_id: Joi.number().min(1).required().integer().max(2147483647),
              group_jur7_id: Joi.number().min(1).integer().required(),
              doc_date: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              iznos_start: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
                .allow(null, ""),
              doc_num: Joi.string().allow(null, ""),
              name: Joi.string().trim().required(),
              edin: Joi.string().trim().required(),
              kol: Joi.number().greater(0).required(),
              summa: Joi.number().min(0).required(),
              inventar_num: Joi.any(),
              serial_num: Joi.any(),
              eski_iznos_summa: Joi.number().min(0).default(0),
            })
          ),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required(),
        year: Joi.number().min(1901).required(),
        month: Joi.number().min(1).max(12).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        kimning_buynida: Joi.number().integer().min(1),
        group_id: Joi.number().integer().min(1),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(99999999),
        search: Joi.string().trim().allow(null, ""),
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
        type: Joi.string().trim().valid("responsible", "group", "product").default("responsible"),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        iznos: Joi.string().trim(),
      }),
    }).options({ stripUnknown: true });
  }

  static getByProduct() {
    return Joi.object({
      query: Joi.object({
        responsible_id: Joi.number().integer().min(1),
        group_id: Joi.number().integer().min(1),
        product_id: Joi.number().integer().min(1),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(99999999),
        search: Joi.string().trim().allow(null, ""),
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
        rasxod: Joi.string().trim().valid("true", "false"),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        iznos: Joi.string().trim(),
      }),
    }).options({ stripUnknown: true });
  }

  static checkFirst() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        year: Joi.number().min(1901).required(),
        month: Joi.number().min(1).max(12).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static create() {
    return Joi.object({
      body: Joi.object({
        year: Joi.number().min(1901).max(2099).required().integer(),
        month: Joi.number().min(1).max(12).required().integer(),
      }),

      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static deleteById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      body: Joi.object({
        year: Joi.number().min(1901).max(2099).required().integer(),
        month: Joi.number().min(1).max(12).required().integer(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static deleteByGroup() {
    return Joi.object({
      query: Joi.object({
        year: Joi.number().min(1901).max(2099).required().integer(),
        month: Joi.number().min(1).max(12).required().integer(),
        main_schet_id: Joi.number().integer().min(1).required(),
        group_id: Joi.number().integer().min(1).required(),
        name: Joi.string().trim().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static cleanData() {
    return Joi.object({
      query: Joi.object({
        password: Joi.string().trim().required(),
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static check() {
    return Joi.object({
      query: Joi.object({
        year: Joi.number().min(1901).max(2099).required().integer(),
        month: Joi.number().min(1).max(12).required().integer(),
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).required().integer(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  // old
  static updateIznosSumma() {
    return Joi.object({
      body: Joi.object({
        iznos_summa: Joi.number().min(1).required(),
      }),

      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }
};
