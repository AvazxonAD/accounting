const Joi = require("joi");

const kassaValidation = Joi.object({
  doc_num: Joi.string(),
  doc_date: Joi.string(),
  prixod_summa: Joi.number().required(),
  rasxod_summa: Joi.number().required(),
  opisanie: Joi.string().required(),
  id_podotchet_litso: Joi.number().required(),
  childs: Joi.array().required(),
}).options({ stripUnknown: true });

const kassaChildValidation = Joi.object({}).options({ stripUnknown: true });

module.exports = {
  kassaValidation,
};
