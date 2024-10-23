const Joi = require('joi')

const pereotsenkaValidation = Joi.object({
    name: Joi.string().trim(),
    oy_1: Joi.number(),
    oy_2: Joi.number(),
    oy_3: Joi.number(),
    oy_4: Joi.number(),
    oy_5: Joi.number(),
    oy_6: Joi.number(),
    oy_7: Joi.number(),
    oy_8: Joi.number(),
    oy_9: Joi.number(),
    oy_10: Joi.number(),
    oy_11: Joi.number(),
    oy_12: Joi.number()
}).options({ stripUnknown: true });

const groupValidation = Joi.object({
    pereotsenka_jur7_id: Joi.number().required(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    provodka_subschet: Joi.string().trim(),
    provodka_kredit: Joi.string().trim()
}).options({ stripUnknown: true });

const podrazdelenieValidation = Joi.object({
    name: Joi.string().trim()
}).options({ stripUnknown: true });

const responsibleValidation = Joi.object({
    fio: Joi.string().trim(),
    spravochnik_podrazdelenie_jur7_id: Joi.number().required()
}).options({ stripUnknown: true });

const naimenovanieValidation = Joi.object({
    spravochnik_budjet_name_id: Joi.number().required(),
    name: Joi.string().trim(),
    edin: Joi.string().trim(),
    group_jur7_id: Joi.number().required() 
}).options({ stripUnknown: true });


const documentJur7Validation = Joi.object({
  type_document: Joi.number(),
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  j_o_num: Joi.string().trim(),
  opisanie: Joi.string().trim(),
  doverennost: Joi.string().trim(),
  kimdan_id: Joi.number().required(),
  kimdan_name: Joi.string().trim(),
  kimga_id: Joi.number().required(),
  kimga_name: Joi.string().trim(),
  id_shartnomalar_organization: Joi.number(),
  childs: Joi.array().required().items(
    Joi.object({
      document_jur7_id: Joi.number().required(),
      naimenovanie_tovarov_jur7_id: Joi.number().required(),
      kol: Joi.number(),
      sena: Joi.number(),
      summa: Joi.number(),
      debet_schet: Joi.string().trim(),
      debet_sub_schet: Joi.string().trim(),
      kredit_schet: Joi.string().trim(),
      kredit_sub_schet: Joi.string().trim(),
      data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    })
  )
}).options({ stripUnknown: true });

const queryValidation = Joi.object({
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  }).options({ stripUnknown: true });
  

module.exports = { pereotsenkaValidation, groupValidation, podrazdelenieValidation, responsibleValidation, naimenovanieValidation, documentJur7Validation, queryValidation }
