const Joi = require("joi");

const bankPrixodValidation = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.string().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string(),
  id_spravochnik_organization: Joi.number().required(),
  id_shartnomalar_organization: Joi.number().allow(null),
  childs: Joi.array().required().items(
    Joi.object({
      summa: Joi.number().required(),
      spravochnik_operatsii_id: Joi.number().required(),
      id_spravochnik_podrazdelenie: Joi.number(),
      id_spravochnik_sostav: Joi.number(),
      id_spravochnik_type_operatsii: Joi.number(),
      id_spravochnik_podotchet_litso: Joi.number(),
    })
  )
}).options({ stripUnknown: true });

const queryValidation = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  limit: Joi.number().min(1).default(10),
  page: Joi.number().min(1).default(1),
  from: Joi.string().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
}).options({ stripUnknown: true });

module.exports = {
  bankPrixodValidation,
  queryValidation,
};
