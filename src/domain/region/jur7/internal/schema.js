const Joi = require("joi");

exports.InternalSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        j_o_num: Joi.string().trim(),
        opisanie: Joi.string().trim(),
        doverennost: Joi.string().trim(),
        kimdan_id: Joi.number().integer().min(1).required(),
        kimga_id: Joi.number().integer().min(1).required(),
        kimga_name: Joi.string().trim(),
        kimdan_name: Joi.string().trim(),
        childs: Joi.array()
          .required()
          .items(
            Joi.object({
              iznos_start: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              naimenovanie_tovarov_jur7_id: Joi.number().required(),
              kol: Joi.number().min(1).required(),
              sena: Joi.number().min(0).required(),
              debet_schet: Joi.string().trim(),
              debet_sub_schet: Joi.string().trim(),
              kredit_schet: Joi.string().trim(),
              kredit_sub_schet: Joi.string().trim(),
              data_pereotsenka: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              iznos: Joi.boolean().default(false),
              iznos_schet: Joi.string().trim().allow(""),
              iznos_sub_schet: Joi.string().trim().allow(""),
              iznos_summa: Joi.number().min(0).default(0),
            })
          ),
      }),
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
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
        j_o_num: Joi.string().trim(),
        opisanie: Joi.string().trim(),
        doverennost: Joi.string().trim(),
        kimdan_id: Joi.number().integer().min(1).required(),
        kimga_id: Joi.number().integer().min(1).required(),
        kimga_name: Joi.string().trim(),
        kimdan_name: Joi.string().trim(),
        childs: Joi.array()
          .required()
          .items(
            Joi.object({
              iznos_start: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              naimenovanie_tovarov_jur7_id: Joi.number().required(),
              kol: Joi.number().min(1).required(),
              sena: Joi.number().min(0).required(),
              debet_schet: Joi.string().trim(),
              debet_sub_schet: Joi.string().trim(),
              kredit_schet: Joi.string().trim(),
              kredit_sub_schet: Joi.string().trim(),
              data_pereotsenka: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              iznos: Joi.boolean().default(false),
              iznos_schet: Joi.string().trim().allow(""),
              iznos_sub_schet: Joi.string().trim().allow(""),
              iznos_summa: Joi.number().min(0).default(0),
            })
          ),
      }),
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        search: Joi.string().trim().allow(null, ""),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
        order_by: Joi.string().trim().default("doc_date").valid("doc_num", "doc_date", "id"),
        order_type: Joi.string().trim().allow(null, "").default("DESC").valid("ASC", "DESC"),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }
};
