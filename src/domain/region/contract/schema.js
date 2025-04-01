const Joi = require("joi");

exports.ContractSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        opisanie: Joi.string().trim(),
        spravochnik_organization_id: Joi.number().required(),
        pudratchi_bool: Joi.boolean(),
        yillik_oylik: Joi.boolean(),
        grafiks: Joi.array().items(
          Joi.object({
            smeta_id: Joi.number().integer().min(1).required(),
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
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        opisanie: Joi.string().trim(),
        spravochnik_organization_id: Joi.number().required(),
        pudratchi_bool: Joi.boolean(),
        yillik_oylik: Joi.boolean(),
        grafiks: Joi.array().items(
          Joi.object({
            id: Joi.number().integer().min(1),
            smeta_id: Joi.number().integer().min(1).required(),
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
        budjet_id: Joi.number().integer().min(1).required(),
      }),
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().min(1).default(1),
        limit: Joi.number().min(1).default(10),
        budjet_id: Joi.number().min(1).required(),
        organ_id: Joi.number().min(1),
        pudratchi_bool: Joi.string().pattern(/^(true|false)$/),
        search: Joi.string().trim().allow(null, ""),
        contract_id: Joi.number().min(1).integer(),
        order_by: Joi.string()
          .trim()
          .default("doc_date")
          .valid("doc_num", "doc_date", "id"),
        order_type: Joi.string()
          .trim()
          .allow(null, "")
          .default("DESC")
          .valid("ASC", "DESC"),
      }),
    });
  }

  static getById() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
      }),
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    });
  }

  static delete() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
      }),
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
    });
  }
};
