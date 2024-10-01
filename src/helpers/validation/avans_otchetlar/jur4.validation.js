const Joi = require("joi");

const jur4Validation = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.date(),
  opisanie: Joi.string(),
  spravochnik_operatsii_own_id: Joi.number().required(),
  spravochnik_podotchet_litso_id: Joi.number(),
  childs: Joi.array().items(
    Joi.object({
      spravochnik_operatsii_id: Joi.number().required(),
      summa: Joi.number().required(),
      id_spravochnik_podrazdelenie: Joi.number(),
      id_spravochnik_sostav: Joi.number(),
      id_spravochnik_type_operatsii: Joi.number(),
    }),
  ),
}).options({ stripUnknown: true });

module.exports = {
    jur4Validation
};
