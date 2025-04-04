const Joi = require(`joi`);

exports.MainSchetSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        spravochnik_budjet_name_id: Joi.number().required(),
        account_number: Joi.string().trim().trim().required(),
        tashkilot_nomi: Joi.string().trim().required(),
        tashkilot_bank: Joi.string().trim().required(),
        tashkilot_mfo: Joi.string().trim().required(),
        tashkilot_inn: Joi.string().trim().required(),
        account_name: Joi.string().trim().required(),
        jur1_schet: Joi.string().trim().required(),
        jur2_schet: Joi.string().trim().required(),
        jur3_schets: Joi.array()
          .min(1)
          .required()
          .items(
            Joi.object({
              schet: Joi.string().trim().required(),
            })
          ),
        jur4_schets: Joi.array()
          .min(1)
          .required()
          .items(
            Joi.object({
              schet: Joi.string().trim().required(),
            })
          ),
        gazna_number: Joi.string().trim(),
      }),
    });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        limit: Joi.number().min(1).default(9999),
        budjet_id: Joi.number().min(1).integer().required(),
        page: Joi.number().min(1).default(1),
        search: Joi.string().trim(),
      }),
    });
  }
};
