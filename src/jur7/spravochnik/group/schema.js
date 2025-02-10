const Joi = require('joi');

exports.GroupSchema = class {
  static import() {
    return Joi.object({
      file: Joi.object({
        path: Joi.string().trim().required()
      })
    })
  }

  static importData(lang) {
    return Joi.array().items(
      Joi.object({
        smeta_id: Joi.number().min(1).integer().required().messages({ '*': lang.t('validation.smetaId') }),
        name: Joi.string().trim().messages({ '*': lang.t('validation.groupName') }),
        schet: Joi.any().messages({ '*': lang.t('validation.schet') }),
        iznos_foiz: Joi.number().messages({ '*': lang.t('validation.iznosFoiz') }),
        provodka_debet: Joi.any().messages({ '*': lang.t('validation.provodkaDebet') }),
        group_number: Joi.any().messages({ '*': lang.t('validation.groupNumber') }),
        provodka_kredit: Joi.any().messages({ '*': lang.t('validation.provodkaKredit') }),
        provodka_subschet: Joi.any().messages({ '*': lang.t('validation.provodkaSubschet') }),
        roman_numeral: Joi.any().messages({ '*': lang.t('validation.romanNumeral') }),
        pod_group: Joi.any().messages({ '*': lang.t('validation.podGroup') })
      })
    ).min(1).required().messages({ '*': lang.t('validation.groupMinError') })
  }
}

exports.createSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().min(1).integer().required(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    group_number: Joi.string().trim(),
    provodka_kredit: Joi.string().trim(),
    provodka_subschet: Joi.string().trim(),
    roman_numeral: Joi.string().trim(),
    pod_group: Joi.string().trim()

  })
}).options({ stripUnknown: true });

exports.updateSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().required().min(1).integer(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    group_number: Joi.string().trim(),
    provodka_kredit: Joi.string().trim(),
    provodka_subschet: Joi.string().trim(),
    roman_numeral: Joi.string().trim(),
    pod_group: Joi.string().trim()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
});

exports.getSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.getByIdGroupSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });
