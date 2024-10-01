const Joi = require("joi");

const bankPrixodValidator = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.date(),
  opisanie: Joi.string(),
  id_spravochnik_organization: Joi.number().required(),
  id_shartnomalar_organization: Joi.number(),
  spravochnik_operatsii_own_id: Joi.number().required(),
  childs: Joi.array().required(),
}).options({ stripUnknown: true });

const bankPrixodChildValidation = Joi.object({
  summa: Joi.number().required(),
  spravochnik_operatsii_id: Joi.number().required(),
  id_spravochnik_podrazdelenie: Joi.number(),
  id_spravochnik_sostav: Joi.number(),
  id_spravochnik_type_operatsii: Joi.number(),
  id_spravochnik_podotchet_litso: Joi.number(),
}).options({ stripUnknown: true });

const queryValidation = Joi.object({
  main_schet_id: Joi.number().required(),
  limit: Joi.number(),
  page: Joi.number(),
  from: Joi.date().required(),
  to: Joi.date().required(),
}).options({ stripUnknown: true });

module.exports = {
  bankPrixodValidator,
  bankPrixodChildValidation,
  queryValidation,
};
