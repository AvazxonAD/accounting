const Joi = require("joi");

const bankRasxodValidation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string().trim(),
  id_spravochnik_organization: Joi.number().required(),
  id_shartnomalar_organization: Joi.number().allow(null),
  childs: Joi.array().required().items(
    Joi.object({
      summa: Joi.number().required(),
      spravochnik_operatsii_id: Joi.number().required(),
      id_spravochnik_podrazdelenie: Joi.number(),
      id_spravochnik_sostav: Joi.number(),
      id_spravochnik_type_operatsii: Joi.number()
    })
  )
}).options({ stripUnknown: true });

module.exports = { bankRasxodValidation };
