const Joi = require("joi");

exports.AktSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        opisanie: Joi.string().trim(),
        spravochnik_operatsii_own_id: Joi.number().min(1).integer(),
        spravochnik_podotchet_litso_id: Joi.number()
          .min(1)
          .integer()
          .required(),
        childs: Joi.array()
          .items(
            Joi.object({
              spravochnik_operatsii_id: Joi.number().required(),
              summa: Joi.number().required(),
              id_spravochnik_podrazdelenie: Joi.number().allow(null),
              id_spravochnik_sostav: Joi.number().allow(null),
              id_spravochnik_type_operatsii: Joi.number().allow(null),
            })
          )
          .min(1)
          .required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
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
        spravochnik_operatsii_own_id: Joi.number().integer().min(1),
        spravochnik_podotchet_litso_id: Joi.number().required(),
        childs: Joi.array()
          .items(
            Joi.object({
              spravochnik_operatsii_id: Joi.number().required(),
              summa: Joi.number().required(),
              id_spravochnik_podrazdelenie: Joi.number().allow(null),
              id_spravochnik_sostav: Joi.number().allow(null),
              id_spravochnik_type_operatsii: Joi.number().allow(null),
            })
          )
          .min(1)
          .required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1).integer(),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        search: Joi.string().trim().allow(null, ""),
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
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
