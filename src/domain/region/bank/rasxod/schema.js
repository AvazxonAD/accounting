const Joi = require("joi");

exports.BankRasxodSchema = class {
  static payment() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().integer().required().min(1),
      }),
      params: Joi.object({
        id: Joi.number().integer().required().min(1),
      }),
      body: Joi.object({
        status: Joi.boolean().required(),
      }),
    });
  }

  static fio() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
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
        opisanie: Joi.string().trim(),
        rukovoditel: Joi.string().trim().allow(null, ""),
        glav_buxgalter: Joi.string().trim().allow(null, ""),
        id_spravochnik_organization: Joi.number().min(1).integer().required(),
        id_shartnomalar_organization: Joi.number().min(1).integer().allow(null),
        shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_id: Joi.number()
          .min(1)
          .integer()
          .allow(null),
        organization_by_raschet_schet_gazna_id: Joi.number()
          .min(1)
          .integer()
          .allow(null),
        main_zarplata_id: Joi.number().allow(null),
        childs: Joi.array()
          .items(
            Joi.object({
              spravochnik_operatsii_id: Joi.number().required(),
              summa: Joi.number().required(),
              id_spravochnik_podrazdelenie: Joi.number()
                .integer()
                .min(1)
                .allow(null),
              id_spravochnik_sostav: Joi.number().integer().min(1).allow(null),
              id_spravochnik_type_operatsii: Joi.number()
                .integer()
                .min(1)
                .allow(null),
              main_zarplata_id: Joi.number().integer().min(1).allow(null),
              id_spravochnik_podotchet_litso: Joi.number()
                .integer()
                .min(1)
                .allow(null),
            })
          )
          .min(1),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
      }),
    }).options({ stripUnknown: true });
  }

  static importData() {
    return Joi.object({
      body: Joi.object({
        docs: Joi.array()
          .items(
            Joi.object({
              idSpravochnikOrganization: Joi.number()
                .integer()
                .min(1)
                .required(),
              opisanie: Joi.string().min(10).required(),
              organizationByRaschetSchetId: Joi.number()
                .integer()
                .min(1)
                .allow(null),
              organizationByRaschetSchetGaznaId: Joi.number()
                .integer()
                .min(1)
                .allow(null),
              childs: Joi.array()
                .min(1)
                .required()
                .items(
                  Joi.object({
                    spravochnikOperatsiiId: Joi.number()
                      .integer()
                      .min(1)
                      .required(),
                    summa: Joi.number().integer().min(1).required(),
                  })
                ),
            })
          )
          .min(1)
          .required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
      }).required(),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
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
        rukovoditel: Joi.string().trim().allow(null, ""),
        glav_buxgalter: Joi.string().trim().allow(null, ""),
        id_spravochnik_organization: Joi.number().min(1).integer().required(),
        id_shartnomalar_organization: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_id: Joi.number()
          .min(1)
          .integer()
          .allow(null),
        organization_by_raschet_schet_gazna_id: Joi.number()
          .min(1)
          .integer()
          .allow(null),
        shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
        main_zarplata_id: Joi.number().allow(null),
        childs: Joi.array()
          .items(
            Joi.object({
              spravochnik_operatsii_id: Joi.number().required(),
              summa: Joi.number().required(),
              id_spravochnik_podrazdelenie: Joi.number()
                .integer()
                .min(1)
                .allow(null),
              id_spravochnik_sostav: Joi.number().integer().min(1).allow(null),
              id_spravochnik_type_operatsii: Joi.number()
                .integer()
                .min(1)
                .allow(null),
              main_zarplata_id: Joi.number().integer().min(1).allow(null),
              id_spravochnik_podotchet_litso: Joi.number()
                .integer()
                .min(1)
                .allow(null),
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
