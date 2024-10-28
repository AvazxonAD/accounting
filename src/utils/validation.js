const Joi = require("joi");

const accessValidation = Joi.object({
    kassa: Joi.boolean().default(false),
    bank: Joi.boolean().default(false),
    spravochnik: Joi.boolean().default(false),
    organization_monitoring: Joi.boolean().default(false),
    region_users: Joi.boolean().default(false),
    smeta: Joi.boolean().default(false),
    region: Joi.boolean().default(false),
    role: Joi.boolean().default(false),
    users: Joi.boolean().default(false),
    shartnoma: Joi.boolean().default(false),
    jur3: Joi.boolean().default(false),
    jur4: Joi.boolean().default(false),
    podotchet_monitoring: Joi.boolean().default(false), 
    budjet: Joi.boolean().default(false),
    access: Joi.boolean().default(false),
    smeta_grafik: Joi.boolean().default(false),
    jur152: Joi.boolean().default(false)
  }).options({ stripUnknown: true });

  const authValidation = Joi.object({
    login: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    main_schet_id: Joi.number(),
  }).options({ stripUnknown: true });
  
  const authUpdateValidation = Joi.object({
    fio: Joi.string().trim().required().trim(),
    login: Joi.string().trim().required().trim(),
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().required(),
  }).options({ stripUnknown: true });

  const regionValidation = Joi.object({
    name: Joi.string().trim().required(),
  }).options({ stripUnknown: true });
  const roleValidation = Joi.object({
    name: Joi.string().trim().required(),
  }).options({ stripUnknown: true });

  const userValidation = Joi.object({
    login: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    fio: Joi.string().trim().required(),
    role_id: Joi.number(),
    region_id: Joi.number(),
  }).options({ stripUnknown: true });

  const jur4Validation = Joi.object({
    doc_num: Joi.string().trim(),
    doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    opisanie: Joi.string().trim(),
    spravochnik_operatsii_own_id: Joi.number().required(),
    spravochnik_podotchet_litso_id: Joi.number().required(),
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

  const jur3Validation = Joi.object({
    doc_num: Joi.string().trim(),
    doc_date: Joi.string().trim().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
    opisanie: Joi.string().trim(),
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

  const bankPrixodValidation = Joi.object({  
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
        id_spravochnik_type_operatsii: Joi.number(),
        id_spravochnik_podotchet_litso: Joi.number(),
      })
    )
  }).options({ stripUnknown: true });
  
  const bankQueryValidation = Joi.object({
    main_schet_id: Joi.number().required().min(1),
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  }).options({ stripUnknown: true });
  
  const bankCapValidation = Joi.object({
    main_schet_id: Joi.number().required().min(1),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required() 
  })

  const bankRasxodValidation = Joi.object({
    doc_num: Joi.string().trim(),
    doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    opisanie: Joi.string().trim(),
    id_spravochnik_organization: Joi.number().required(),
    id_shartnomalar_organization: Joi.number().allow(null),
    rukovoditel: Joi.string(),
    glav_buxgalter: Joi.string(),
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


const docPrixodJur7Validation = Joi.object({
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

const jur7QueryValidation = Joi.object({ // ozgar_keyin 
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  }).options({ stripUnknown: true });
  

  const kassaValidation = Joi.object({
    doc_num: Joi.string().trim(),
    doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    opisanie: Joi.string().trim(),
    id_podotchet_litso: Joi.number(),
    childs: Joi.array()
      .items(
        Joi.object({
          spravochnik_operatsii_id: Joi.number().required(),
          summa: Joi.number().required(),
          id_spravochnik_podrazdelenie: Joi.number(),
          id_spravochnik_sostav: Joi.number(),
          id_spravochnik_type_operatsii: Joi.number(),
        }),
      )
  }).options({ stripUnknown: true });


  const queryValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    search: Joi.string().trim(),
}).options({ stripUnknown: true });

const validationQuery = Joi.object({
  main_schet_id: Joi.number().required().min(1),
  limit: Joi.number().min(1).default(10),
  page: Joi.number().min(1).default(1),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
}).options({ stripUnknown: true });

const organizationMonitoringValidation = Joi.object({
    main_schet_id: Joi.number().required().min(1),
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    spravochnik_organization_id: Joi.number().min(1).required()
}).options({ stripUnknown: true });


const shartnomaValidation = Joi.object({
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  summa: Joi.number(),
  opisanie: Joi.string().trim(),
  smeta_id: Joi.number().required(),
  smeta2_id: Joi.number(),
  spravochnik_organization_id: Joi.number().required(),
  pudratchi_bool: Joi.boolean(),
  yillik_oylik: Joi.boolean().required()
}).options({ stripUnknown: true });

const shartnomaGarfikValidation = Joi.object({
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
}).options({ stripUnknown: true });

const ShartnomaqueryValidation = Joi.object({ 
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  main_schet_id: Joi.number().min(1),
  organization: Joi.number().min(1),
  pudratchi: Joi.string().pattern(/^(true|false)$/),
  search: Joi.string().trim()
}).options({ stripUnknown: true });

const showServicesValidation = Joi.object({
  spravochnik_operatsii_own_id: Joi.number().required(),
  doc_num: Joi.string().trim(),
  doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  opisanie: Joi.string().trim(),
  id_spravochnik_organization: Joi.number().required(),
  shartnomalar_organization_id: Joi.number(),
  childs: Joi.array()
  .items(
    Joi.object({
      spravochnik_operatsii_id: Joi.number().required(),
      summa: Joi.number().required(),
      id_spravochnik_podrazdelenie: Joi.number(),
      id_spravochnik_sostav: Joi.number(),
      id_spravochnik_type_operatsii: Joi.number(),
    }),
  ) 
}).options({ stripUnknown: true });

const smetaValidation = Joi.object({
  smeta_name: Joi.string().trim().required(),
  smeta_number: Joi.number().required().required(),
  father_smeta_name: Joi.string().trim().required(),
}).options({ stripUnknown: true });

const smetaGrafikValidation = Joi.object({
  smeta_id: Joi.number().required().required(),
  spravochnik_budjet_name_id: Joi.number().required().required(),
  year: Joi.number().required().required(),
}).options({ stripUnknown: true });

const smetaGrafikUpdateValidation = Joi.object({
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
}).options({ stripUnknown: true });

const budjetValidation = Joi.object({
  name: Joi.string().trim().required(),
}).options({ stripUnknown: true });

const mainSchetValidator = Joi.object({
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
}).options({ stripUnknown: true });

const queryMainSchetValidation = Joi.object({
  limit: Joi.number().min(1).default(10),
  page: Joi.number().min(1).default(1),
  search: Joi.string().trim()
}).options({ stripUnknown: true });

const operatsiiValidation = Joi.object({
  name: Joi.string().trim().required(),
  schet: Joi.string().trim().required(),
  sub_schet: Joi.string().trim().required(),
  type_schet: Joi.string().trim().required(),
  smeta_id: Joi.number().required(),
}).options({ stripUnknown: true });

const operatsiiQueryValidation = Joi.object({ 
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  type_schet: Joi.string().trim()
}).options({ stripUnknown: true });

const organizationValidation = Joi.object({
  name: Joi.string().trim().required(),
  bank_klient: Joi.string().trim().required(),
  raschet_schet: Joi.string().trim().required(),
  raschet_schet_gazna: Joi.string().trim().required(),
  mfo: Joi.string().trim().required(),
  inn: Joi.string().trim().required(),
  okonx: Joi.string().trim().required(),
}).options({ stripUnknown: true });

const organizationQueryValidation = Joi.object({ 
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  inn: Joi.number(),
  search: Joi.string()
}).options({ stripUnknown: true });

const podotchetQueryValidation = Joi.object({ 
  main_schet_id: Joi.number().required().min(1),
  limit: Joi.number().min(1).default(10),
  page: Joi.number().min(1).default(1),
  from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  podotchet: Joi.number().min(1).required()
}).options({ stripUnknown: true });

const podotchetLitsoValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required()
}).options({ stripUnknown: true });


const podrazdelenieValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required(),
}).options({ stripUnknown: true });

const sostavValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required(),
}).options({ stripUnknown: true });

const typeOperatsiiValidation = Joi.object({
  name: Joi.string().trim().required(),
  rayon: Joi.string().trim().required(),
}).options({ stripUnknown: true });

module.exports = {
  jur7QueryValidation,
  kassaValidation,
  queryValidation,
  organizationMonitoringValidation,
  shartnomaValidation,
  shartnomaGarfikValidation,
  ShartnomaqueryValidation,
  showServicesValidation,
  smetaValidation,
  smetaGrafikValidation,
  smetaGrafikUpdateValidation,
  budjetValidation,
  mainSchetValidator,
  queryMainSchetValidation,
  operatsiiValidation,
  operatsiiQueryValidation,
  organizationValidation,
  organizationQueryValidation,
  podotchetQueryValidation,
  podotchetLitsoValidation,
  podrazdelenieValidation,
  sostavValidation,
  typeOperatsiiValidation,
  accessValidation,
  authValidation,
  authUpdateValidation,
  regionValidation,
  roleValidation,
  userValidation,
  jur4Validation,
  jur3Validation,
  bankPrixodValidation,
  bankQueryValidation,
  bankCapValidation,
  bankRasxodValidation,
  pereotsenkaValidation,
  groupValidation,
  responsibleValidation,
  naimenovanieValidation,
  docPrixodJur7Validation,
  validationQuery
};

