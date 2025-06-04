const Joi = require("joi");

exports.PrixodJur7Schema = class {
  static readFile() {
    return Joi.object({
      file: Joi.object({
        path: Joi.string().trim().required(),
      }),
    });
  }

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
        kimdan_name: Joi.string().trim().allow(null),
        kimga_id: Joi.number().integer().min(1).required(),
        kimga_name: Joi.string().trim().allow(null),
        id_shartnomalar_organization: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
        shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
        childs: Joi.array()
          .required()
          .items(
            Joi.object({
              group_jur7_id: Joi.number().required(),
              iznos_start: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              kol: Joi.number().min(1).required(),
              sena: Joi.number().min(0).required(),
              nds_foiz: Joi.number().min(1).allow(0).max(99).default(0),
              debet_schet: Joi.string().trim(),
              debet_sub_schet: Joi.string().trim(),
              kredit_schet: Joi.string().trim(),
              kredit_sub_schet: Joi.string().trim(),
              data_pereotsenka: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              iznos: Joi.boolean().required(),
              name: Joi.string().trim().required(),
              unit_id: Joi.number().min(1).integer().required(),
              inventar_num: Joi.string().trim(),
              serial_num: Joi.string().trim(),
              eski_iznos_summa: Joi.number().min(0).default(0),
              iznos_schet: Joi.string().trim().allow(""),
              iznos_sub_schet: Joi.string().trim().allow(""),
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
        kimdan_name: Joi.string().trim().allow(null),
        kimga_id: Joi.number().integer().min(1).required(),
        kimga_name: Joi.string().trim().allow(null),
        id_shartnomalar_organization: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
        shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
        childs: Joi.array()
          .required()
          .items(
            Joi.object({
              group_jur7_id: Joi.number().required(),
              iznos_start: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              kol: Joi.number().min(1).required(),
              sena: Joi.number().min(0).required(),
              nds_foiz: Joi.number().min(1).allow(0).max(99).default(0),
              debet_schet: Joi.string().trim(),
              debet_sub_schet: Joi.string().trim(),
              kredit_schet: Joi.string().trim(),
              kredit_sub_schet: Joi.string().trim(),
              data_pereotsenka: Joi.string()
                .trim()
                .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
              iznos: Joi.boolean().required(),
              name: Joi.string().trim().required(),
              edin_id: Joi.number().min(1).integer().required(),
              inventar_num: Joi.string().trim(),
              serial_num: Joi.string().trim(),
              eski_iznos_summa: Joi.number().min(0).default(0),
              iznos_schet: Joi.string().trim().allow(""),
              iznos_sub_schet: Joi.string().trim().allow(""),
            })
          ),
      }),
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
      }),
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
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
        orderBy: Joi.string().trim().default("DESC").valid("ASC", "DESC"),
        orderType: Joi.string().trim().default("doc_num").valid("doc_num", "doc_date"),
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
        akt: Joi.string().trim().valid("true", "false"),
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static rasxodDocs() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required(),
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

  static report() {
    return Joi.object({
      query: Joi.object({
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static import(lang) {
    return Joi.object({
      nds_foiz: Joi.number()
        .min(1)
        .required()
        .messages({ "*": lang.t("validation.ndsFoiz") }),
      group_jur7_id: Joi.number()
        .required()
        .integer()
        .messages({ "*": lang.t("validation.groupId") }),
      name: Joi.string()
        .trim()
        .required()
        .messages({ "*": lang.t("validation.productName") }),
      edin: Joi.string()
        .trim()
        .required()
        .messages({ "*": lang.t("validation.edin") }),
      kol: Joi.number()
        .min(1)
        .required()
        .messages({ "*": lang.t("validation.kol") }),
      summa: Joi.number()
        .min(0)
        .required()
        .messages({ "*": lang.t("validation.summa") }),
      inventar_num: Joi.any().messages({
        "*": lang.t("validation.inventarNum"),
      }),
      serial_num: Joi.any().messages({ "*": lang.t("validation.serialNum") }),
      iznos: Joi.any().messages({ "*": lang.t("validation.iznos") }),
      nds_foiz: Joi.number()
        .min(0)
        .max(99)
        .messages({ "*": lang.t("validation.ndsFoiz") }),
      eski_iznos_summa: Joi.number()
        .min(0)
        .default(0)
        .messages({ "*": lang.t("validation.eskiIznosSumma") }),
    }).options({ stripUnknown: true });
  }

  static importSchema2() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().integer().min(1).required(),
        main_schet_id: Joi.number().integer().min(1).required(),
      }),
    });
  }
};
