const Joi = require("joi");

const bankPrixodValidator = Joi.object({
  doc_num: Joi.string().allow(null),
  doc_date: Joi.date().allow(null),
  opisanie: Joi.string().allow(null),
  id_spravochnik_organization: Joi.number().required(),
  id_shartnomalar_organization: Joi.number().allow(null),
  spravochnik_operatsii_own_id: Joi.number().required(),
  childs: Joi.array().required(),
}).options({ stripUnknown: true });

const bankPrixodChildValidation = Joi.object({
  summa: Joi.number().required(),
  spravochnik_operatsii_id: Joi.number().required(),
  id_spravochnik_podrazdelenie: Joi.number().allow(null),
  id_spravochnik_sostav: Joi.number().allow(null),
  id_spravochnik_type_operatsii: Joi.number().allow(null),
  id_spravochnik_podotchet_litso: Joi.number().allow(null),
}).options({ stripUnknown: true });

const queryValidationBank = Joi.object({
  main_schet_id: Joi.number().required(),
  limit: Joi.number(),
  page: Joi.number(),
  from: Joi.date().required(),
  to: Joi.date().required(),
}).options({ stripUnknown: true });

module.exports = {
  bankPrixodValidator,
  bankPrixodChildValidation,
  queryValidationBank,
};
