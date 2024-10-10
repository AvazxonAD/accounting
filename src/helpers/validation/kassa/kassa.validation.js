const Joi = require("joi");

const kassaValidation = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.string().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string(),
  id_podotchet_litso: Joi.number(),
  childs: Joi.array()
    .items(
      Joi.object({
        spravochnik_operatsii_id: Joi.number().required(),
        summa: Joi.number().required(),
        id_spravochnik_podrazdelenie: Joi.number(),
        id_spravochnik_sostav: Joi.number(),
        id_spravochnik_type_operatsii: Joi.number(),
      }),
    )
}).options({ stripUnknown: true });

module.exports = {
  kassaValidation,
};
