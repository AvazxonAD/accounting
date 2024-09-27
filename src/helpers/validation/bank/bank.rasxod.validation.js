const Joi = require("joi");

const bankRasxodValidation = Joi.object({
  doc_num: Joi.string().allow(null),
  doc_date: Joi.date().allow(null),
  opisanie: Joi.string().allow(null),
  id_spravochnik_organization: Joi.number().required(),
  spravochnik_operatsii_own_id: Joi.number().required(),
  id_shartnomalar_organization: Joi.number().allow(null),
  childs: Joi.array().required()
}).options({ stripUnknown: true });

const bankRasxodChildValidation = Joi.object({
  summa: Joi.number().required(),
  spravochnik_operatsii_id: Joi.number().required(),
  id_spravochnik_podrazdelenie: Joi.number().allow(null),
  id_spravochnik_sostav: Joi.number().allow(null),
  id_spravochnik_type_operatsii: Joi.number().allow(null),
}).options({ stripUnknown: true });

module.exports = {
  bankRasxodValidation,
  bankRasxodChildValidation,
};
