"use strict";

var Joi = require("joi");
var accessValidation = Joi.object({
  kassa: Joi["boolean"]()["default"](false),
  bank: Joi["boolean"]()["default"](false),
  spravochnik: Joi["boolean"]()["default"](false),
  organization_monitoring: Joi["boolean"]()["default"](false),
  region_users: Joi["boolean"]()["default"](false),
  smeta: Joi["boolean"]()["default"](false),
  region: Joi["boolean"]()["default"](false),
  role: Joi["boolean"]()["default"](false),
  users: Joi["boolean"]()["default"](false),
  shartnoma: Joi["boolean"]()["default"](false),
  jur3: Joi["boolean"]()["default"](false),
  jur4: Joi["boolean"]()["default"](false),
  podotchet_monitoring: Joi["boolean"]()["default"](false),
  budjet: Joi["boolean"]()["default"](false),
  access: Joi["boolean"]()["default"](false),
  smeta_grafik: Joi["boolean"]()["default"](false),
  jur152: Joi["boolean"]()["default"](false),
  jur7: Joi["boolean"]()["default"](false)
}).options({
  stripUnknown: true
});
var authValidation = Joi.object({
  login: Joi.string().trim().required(),
  password: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var schetOperatsiiValidation = Joi.object({
  name: Joi.string().trim().required(),
  schet: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var schetOperatsiiQueryValidation = Joi.object({
  search: Joi.string().trim().allow(null, ''),
  limit: Joi.number().min(1)["default"](9999),
  page: Joi.number().min(1)["default"](1)
}).options({
  stripUnknown: true
});
var authUpdateValidation = Joi.object({
  fio: Joi.string().trim().required().trim(),
  login: Joi.string().trim().required().trim(),
  oldPassword: Joi.string().trim().required(),
  newPassword: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var regionValidation = Joi.object({
  name: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var roleValidation = Joi.object({
  name: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var userValidation = Joi.object({
  login: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  fio: Joi.string().trim().required(),
  role_id: Joi.number(),
  region_id: Joi.number()
}).options({
  stripUnknown: true
});
var jur4Validation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string().trim(),
  spravochnik_operatsii_own_id: Joi.number().required(),
  spravochnik_podotchet_litso_id: Joi.number().required(),
  childs: Joi.array().items(Joi.object({
    spravochnik_operatsii_id: Joi.number().required(),
    summa: Joi.number().required(),
    id_spravochnik_podrazdelenie: Joi.number().allow(null),
    id_spravochnik_sostav: Joi.number().allow(null),
    id_spravochnik_type_operatsii: Joi.number().allow(null)
  }))
}).options({
  stripUnknown: true
});
var jur3Validation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
  opisanie: Joi.string().trim(),
  spravochnik_operatsii_own_id: Joi.number().required(),
  id_spravochnik_organization: Joi.number().required(),
  shartnomalar_organization_id: Joi.number().allow(null),
  childs: Joi.array().items(Joi.object({
    spravochnik_operatsii_id: Joi.number().required(),
    summa: Joi.number().required(),
    id_spravochnik_podrazdelenie: Joi.number().allow(null),
    id_spravochnik_sostav: Joi.number().allow(null),
    id_spravochnik_type_operatsii: Joi.number().allow(null)
  }))
}).options({
  stripUnknown: true
});
var bankPrixodValidation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string().trim(),
  id_spravochnik_organization: Joi.number().required(),
  id_shartnomalar_organization: Joi.number().allow(null),
  childs: Joi.array().required().items(Joi.object({
    summa: Joi.number().required(),
    main_zarplata_id: Joi.number(),
    spravochnik_operatsii_id: Joi.number().required(),
    id_spravochnik_podrazdelenie: Joi.number().allow(null),
    id_spravochnik_sostav: Joi.number().allow(null),
    id_spravochnik_type_operatsii: Joi.number().allow(null),
    id_spravochnik_podotchet_litso: Joi.number().allow(null)
  }))
}).options({
  stripUnknown: true
});
var bankQueryValidation = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  limit: Joi.number().min(1)["default"](9999),
  page: Joi.number().min(1)["default"](1),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
}).options({
  stripUnknown: true
});
var bankCapValidation = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
});
var bankRasxodValidation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string().trim(),
  id_spravochnik_organization: Joi.number().required(),
  id_shartnomalar_organization: Joi.number().allow(null),
  rukovoditel: Joi.string(),
  glav_buxgalter: Joi.string(),
  childs: Joi.array().required().items(Joi.object({
    summa: Joi.number().required(),
    spravochnik_operatsii_id: Joi.number().required(),
    id_spravochnik_podrazdelenie: Joi.number(),
    id_spravochnik_sostav: Joi.number(),
    id_spravochnik_type_operatsii: Joi.number(),
    main_zarplata_id: Joi.number().allow(null),
    id_spravochnik_podotchet_litso: Joi.number().allow(null).min(1)
  }))
}).options({
  stripUnknown: true
});
var responsibleValidation = Joi.object({
  fio: Joi.string().trim(),
  spravochnik_podrazdelenie_jur7_id: Joi.number().required()
}).options({
  stripUnknown: true
});
var docPrixodJur7Validation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  j_o_num: Joi.string().trim(),
  opisanie: Joi.string().trim(),
  doverennost: Joi.string().trim(),
  kimdan_id: Joi.number().required(),
  kimdan_name: Joi.string().trim(),
  kimga_id: Joi.number().required(),
  kimga_name: Joi.string().trim(),
  id_shartnomalar_organization: Joi.number().allow(null),
  childs: Joi.array().required().items(Joi.object({
    naimenovanie_tovarov_jur7_id: Joi.number().required(),
    kol: Joi.number(),
    sena: Joi.number(),
    summa: Joi.number().min(1),
    debet_schet: Joi.string().trim(),
    debet_sub_schet: Joi.string().trim(),
    kredit_schet: Joi.string().trim(),
    kredit_sub_schet: Joi.string().trim(),
    data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
  }))
}).options({
  stripUnknown: true
});
var kassaValidation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string().trim(),
  id_podotchet_litso: Joi.number().min(1).integer().allow(null),
  main_zarplata_id: Joi.number().allow(null),
  childs: Joi.array().items(Joi.object({
    spravochnik_operatsii_id: Joi.number().required(),
    summa: Joi.number().required(),
    id_spravochnik_podrazdelenie: Joi.number(),
    id_spravochnik_sostav: Joi.number(),
    id_spravochnik_type_operatsii: Joi.number()
  }))
}).options({
  stripUnknown: true
});
var queryValidation = Joi.object({
  page: Joi.number().min(1)["default"](1),
  limit: Joi.number().min(1)["default"](9999),
  search: Joi.string().trim().allow(null, ''),
  budjet_id: Joi.number(),
  type: Joi.string().trim()
}).options({
  stripUnknown: true
});
var jur7QueryValidation = Joi.object({
  limit: Joi.number().min(1)["default"](9999),
  page: Joi.number().min(1)["default"](1),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
}).options({
  stripUnknown: true
});
var validationQuery = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  limit: Joi.number().min(1)["default"](9999),
  page: Joi.number().min(1)["default"](1),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
}).options({
  stripUnknown: true
});
var jur3CapValidation = Joi.object({
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
}).options({
  stripUnknown: true
});
var organizationMonitoringValidation = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  limit: Joi.number().min(1)["default"](9999),
  page: Joi.number().min(1)["default"](1),
  operatsii: Joi.string().required(),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
}).options({
  stripUnknown: true
});
var aktSverkaValidation = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  shartnoma_id: Joi.number().min(1),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  organ_id: Joi.number().min(1)
}).options({
  stripUnknown: true
});
var orderOrganizationValidation = Joi.object({
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  main_schet_id: Joi.number().required().min(1),
  schet: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var organizationPrixodRasxodValidation = Joi.object({
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  operatsii: Joi.string().trim().required(),
  main_schet_id: Joi.number().min(1).required()
}).options({
  stripUnknown: true
});
var shartnomaValidation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  summa: Joi.number(),
  opisanie: Joi.string().trim(),
  smeta_id: Joi.number().integer().min(1).required(),
  spravochnik_organization_id: Joi.number().required(),
  pudratchi_bool: Joi["boolean"](),
  yillik_oylik: Joi["boolean"]().required()
}).options({
  stripUnknown: true
});
var shartnomaGarfikValidation = Joi.object({
  oy_1: Joi.number().required(),
  oy_2: Joi.number().required(),
  oy_3: Joi.number().required(),
  oy_4: Joi.number().required(),
  oy_5: Joi.number().required(),
  oy_6: Joi.number().required(),
  oy_7: Joi.number().required(),
  oy_8: Joi.number().required(),
  oy_9: Joi.number().required(),
  oy_10: Joi.number().required(),
  oy_11: Joi.number().required(),
  oy_12: Joi.number().required(),
  smeta_id: Joi.number().integer().min(1).required(),
  id_shartnomalar_organization: Joi.number().integer().min(1).required()
}).options({
  stripUnknown: true
});
var ShartnomaqueryValidation = Joi.object({
  page: Joi.number().min(1)["default"](1),
  limit: Joi.number().min(1)["default"](9999),
  budjet_id: Joi.number().min(1),
  organization: Joi.number().min(1),
  pudratchi_bool: Joi.string().pattern(/^(true|false)$/),
  search: Joi.string().trim().allow(null, ''),
  contract_id: Joi.number().min(1).integer()
}).options({
  stripUnknown: true
});
var showServicesValidation = Joi.object({
  spravochnik_operatsii_own_id: Joi.number().required(),
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string().trim(),
  id_spravochnik_organization: Joi.number().required(),
  shartnomalar_organization_id: Joi.number().allow(null),
  childs: Joi.array().items(Joi.object({
    spravochnik_operatsii_id: Joi.number().required(),
    summa: Joi.number().required(),
    id_spravochnik_podrazdelenie: Joi.number().allow(null),
    id_spravochnik_sostav: Joi.number().allow(null),
    id_spravochnik_type_operatsii: Joi.number().allow(null)
  }))
}).options({
  stripUnknown: true
});
var smetaValidation = Joi.object({
  smeta_name: Joi.string().trim().required(),
  smeta_number: Joi.number().required().required(),
  father_smeta_name: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var smetaGrafikValidation = Joi.object({
  smeta_id: Joi.number().required().required(),
  spravochnik_budjet_name_id: Joi.number().required().required(),
  year: Joi.number().required().required(),
  oy_1: Joi.number().required(),
  oy_2: Joi.number().required(),
  oy_3: Joi.number().required(),
  oy_4: Joi.number().required(),
  oy_5: Joi.number().required(),
  oy_6: Joi.number().required(),
  oy_7: Joi.number().required(),
  oy_8: Joi.number().required(),
  oy_9: Joi.number().required(),
  oy_10: Joi.number().required(),
  oy_11: Joi.number().required(),
  oy_12: Joi.number().required()
}).options({
  stripUnknown: true
});
var budjetValidation = Joi.object({
  name: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var mainSchetValidator = Joi.object({
  spravochnik_budjet_name_id: Joi.number().required(),
  account_number: Joi.string().trim().trim().required(),
  tashkilot_nomi: Joi.string().trim().required(),
  tashkilot_bank: Joi.string().trim().required(),
  tashkilot_mfo: Joi.string().trim().required(),
  tashkilot_inn: Joi.string().trim().required(),
  account_name: Joi.string().trim().required(),
  jur1_schet: Joi.string().trim(),
  jur1_subschet: Joi.string().trim(),
  jur2_schet: Joi.string().trim(),
  jur2_subschet: Joi.string().trim(),
  jur3_schet: Joi.string().trim(),
  jur3_subschet: Joi.string().trim(),
  jur4_schet: Joi.string().trim(),
  jur4_subschet: Joi.string().trim(),
  gazna_number: Joi.string().trim()
}).options({
  stripUnknown: true
});
var queryMainSchetValidation = Joi.object({
  limit: Joi.number().min(1)["default"](9999),
  page: Joi.number().min(1)["default"](1),
  search: Joi.string().trim()
}).options({
  stripUnknown: true
});
var operatsiiValidation = Joi.object({
  name: Joi.string().trim().required(),
  schet: Joi.string().trim().required(),
  sub_schet: Joi.string().trim().custom(function (value) {
    return value.replace(/\s+/g, '');
  }),
  type_schet: Joi.string().trim().required().valid('akt', 'bank_prixod', 'avans_otchet', 'kassa_prixod', 'kassa_rasxod', 'bank_rasxod', 'general', 'show_service'),
  smeta_id: Joi.number().min(1),
  budjet_id: Joi.number().min(1).integer()
}).options({
  stripUnknown: true
});
var operatsiiQueryValidation = Joi.object({
  page: Joi.number().min(1)["default"](1),
  limit: Joi.number().min(1)["default"](9999),
  budjet_id: Joi.number().min(1).integer(),
  type_schet: Joi.string().trim(),
  search: Joi.string().trim().allow(null, ''),
  meta_search: Joi.string().trim(),
  schet: Joi.string().trim(),
  sub_schet: Joi.string().trim().custom(function (value) {
    return value.replace(/\s+/g, '');
  })
}).options({
  stripUnknown: true
});
var organizationValidation = Joi.object({
  name: Joi.string().trim().required(),
  bank_klient: Joi.string().trim().required(),
  raschet_schet: Joi.string().trim().required(),
  raschet_schet_gazna: Joi.string().trim().required(),
  mfo: Joi.string().trim().required(),
  inn: Joi.string().trim().required(),
  okonx: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var organizationQueryValidation = Joi.object({
  page: Joi.number().min(1)["default"](1),
  limit: Joi.number().min(1)["default"](9999),
  inn: Joi.number(),
  search: Joi.string()
}).options({
  stripUnknown: true
});
var podotchetQueryValidation = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  limit: Joi.number().min(1)["default"](9999),
  page: Joi.number().min(1)["default"](1),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  podotchet: Joi.number().min(1),
  operatsii: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var prixodRasxodPodotchetValidation = Joi.object({
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  main_schet_id: Joi.number().required().min(1)
});
var podotchetLitsoValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var podrazdelenieValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var jur7PodrazdelenieValidation = Joi.object({
  name: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var sostavValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var typeOperatsiiValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required()
}).options({
  stripUnknown: true
});
var podpisValidation = Joi.object({
  numeric_poryadok: Joi.number().integer().required(),
  doljnost_name: Joi.string().trim().max(255).required(),
  fio_name: Joi.string().trim().max(255).required(),
  type_document: Joi.string().required().max(255).trim()
}).options({
  stripUnknown: true
});
var bankRasxodPayment = Joi.object({
  query: Joi.object({
    main_schet_id: Joi.number().integer().required().min(1)
  }),
  params: Joi.object({
    id: Joi.number().integer().required().min(1)
  }),
  body: Joi.object({
    status: Joi["boolean"]().required()
  })
}).options({
  stripUnknown: true
});
module.exports = {
  kassaValidation: kassaValidation,
  queryValidation: queryValidation,
  organizationMonitoringValidation: organizationMonitoringValidation,
  shartnomaValidation: shartnomaValidation,
  shartnomaGarfikValidation: shartnomaGarfikValidation,
  ShartnomaqueryValidation: ShartnomaqueryValidation,
  showServicesValidation: showServicesValidation,
  smetaValidation: smetaValidation,
  smetaGrafikValidation: smetaGrafikValidation,
  budjetValidation: budjetValidation,
  mainSchetValidator: mainSchetValidator,
  queryMainSchetValidation: queryMainSchetValidation,
  operatsiiValidation: operatsiiValidation,
  operatsiiQueryValidation: operatsiiQueryValidation,
  organizationValidation: organizationValidation,
  organizationQueryValidation: organizationQueryValidation,
  podotchetQueryValidation: podotchetQueryValidation,
  podotchetLitsoValidation: podotchetLitsoValidation,
  podrazdelenieValidation: podrazdelenieValidation,
  sostavValidation: sostavValidation,
  typeOperatsiiValidation: typeOperatsiiValidation,
  accessValidation: accessValidation,
  authValidation: authValidation,
  authUpdateValidation: authUpdateValidation,
  regionValidation: regionValidation,
  roleValidation: roleValidation,
  userValidation: userValidation,
  jur4Validation: jur4Validation,
  jur3Validation: jur3Validation,
  bankPrixodValidation: bankPrixodValidation,
  bankQueryValidation: bankQueryValidation,
  bankCapValidation: bankCapValidation,
  bankRasxodValidation: bankRasxodValidation,
  responsibleValidation: responsibleValidation,
  docPrixodJur7Validation: docPrixodJur7Validation,
  validationQuery: validationQuery,
  jur7PodrazdelenieValidation: jur7PodrazdelenieValidation,
  jur7QueryValidation: jur7QueryValidation,
  aktSverkaValidation: aktSverkaValidation,
  orderOrganizationValidation: orderOrganizationValidation,
  jur3CapValidation: jur3CapValidation,
  podpisValidation: podpisValidation,
  prixodRasxodPodotchetValidation: prixodRasxodPodotchetValidation,
  schetOperatsiiValidation: schetOperatsiiValidation,
  schetOperatsiiQueryValidation: schetOperatsiiQueryValidation,
  bankRasxodPayment: bankRasxodPayment
};