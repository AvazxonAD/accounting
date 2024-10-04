const Joi = require("joi");

const jur3Validation = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
  opisanie: Joi.string(),
  spravochnik_operatsii_own_id: Joi.number().required(),
  id_spravochnik_organization: Joi.number().required(),
  shartnomalar_organization_id: Joi.number(),
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
  jur3Validation,
};
