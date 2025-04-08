const Joi = require("joi");

exports.Jur8MonitoringSchema = class {
  static create() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().min(1).integer().required(),
      }),

      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        childs: Joi.array()
          .items(
            Joi.object({
              type_doc: Joi.string().trim().required(),
              schet_id: Joi.number().integer().required().min(1),
              doc_id: Joi.number().integer().required().min(1),
              rasxod_schet: Joi.string().trim().required(),
              schet: Joi.string().trim().required(),
              doc_num: Joi.string().trim(),
              doc_date: Joi.string()
                .trim()
                .pattern(
                  /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
                ),
              summa: Joi.number().required().min(1),
            })
          )
          .min(1)
          .required(),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().min(1).integer().required(),
      }),

      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        childs: Joi.array()
          .items(
            Joi.object({
              type_doc: Joi.string().trim().required(),
              schet_id: Joi.number().integer().required().min(1),
              doc_id: Joi.number().integer().required().min(1),
              rasxod_schet: Joi.string().trim().required(),
              schet: Joi.string().trim().required(),
              doc_num: Joi.string().trim(),
              doc_date: Joi.string()
                .trim()
                .pattern(
                  /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
                ),
              summa: Joi.number().required().min(1),
            })
          )
          .min(1)
          .required(),
      }),

      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().min(1).integer().default(1),
        year: Joi.number().min(1).integer().min(1901).max(2099),
        budjet_id: Joi.number().min(1).integer().required(),
        limit: Joi.number().min(1).integer().default(10),
      }),
    }).options({ stripUnknown: true });
  }

  static getData() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().min(1).integer().required(),
        month: Joi.number().min(1).integer().max(12).required(),
        year: Joi.number().min(1901).integer().max(2099).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),

      query: Joi.object({
        budjet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),

      query: Joi.object({
        budjet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
