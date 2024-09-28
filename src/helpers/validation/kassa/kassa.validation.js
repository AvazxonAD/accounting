const Joi = require("joi");

const kassaValidation = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.date(),
  opisanie: Joi.string(),
  id_podotchet_litso: Joi.number(),
  spravochnik_operatsii_own_id: Joi.number().required(),
  childs: Joi.array().items(
    Joi.object({
      spravochnik_operatsii_id: Joi.number().required(),
      summa: Joi.number().required(),
      id_spravochnik_podrazdelenie: Joi.number(),
      id_spravochnik_sostav: Joi.number(),
      id_spravochnik_type_operatsii: Joi.number()
    })
  ).required(),
  spravochnik_operatsii_own_id: Joi.number().required()
}).options({ stripUnknown: true });

module.exports = {
  kassaValidation,
};
