const Joi = require('joi')

exports.PrixodSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        j_o_num: Joi.string().trim(),
        opisanie: Joi.string().trim(),
        doverennost: Joi.string().trim(),
        kimdan_id: Joi.number().integer().min(1).required(),
        kimdan_name: Joi.string().trim().allow(null),
        kimga_id: Joi.number().integer().min(1).required(),
        kimga_name: Joi.string().trim().allow(null),
        id_shartnomalar_organization: Joi.number().min(1).allow(null),
        childs: Joi.array().required().items(
          Joi.object({
            group_jur7_id: Joi.number().required(),
            kol: Joi.number().min(1).required(),
            sena: Joi.number().min(1).required(),
            nds_foiz: Joi.number().min(1).allow(0).max(99).default(0),
            debet_schet: Joi.string().trim(),
            debet_sub_schet: Joi.string().trim(),
            kredit_schet: Joi.string().trim(),
            kredit_sub_schet: Joi.string().trim(),
            data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
            iznos: Joi.boolean().required(),
            name: Joi.string().trim().required(),
            edin: Joi.string().trim().required(),
            inventar_num: Joi.string().trim(),
            serial_num: Joi.string().trim(),
            eski_iznos_summa: Joi.number().min(0).default(0)
          })
        )
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim(),
        doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        j_o_num: Joi.string().trim(),
        opisanie: Joi.string().trim(),
        doverennost: Joi.string().trim(),
        kimdan_id: Joi.number().integer().min(1).required(),
        kimdan_name: Joi.string().trim().allow(null),
        kimga_id: Joi.number().integer().min(1).required(),
        kimga_name: Joi.string().trim().allow(null),
        id_shartnomalar_organization: Joi.number().min(1).allow(null),
        childs: Joi.array().required().items(
          Joi.object({
            group_jur7_id: Joi.number().required(),
            kol: Joi.number().min(1).required(),
            sena: Joi.number().min(1).required(),
            nds_foiz: Joi.number().min(1).allow(0).max(99).default(0),
            debet_schet: Joi.string().trim(),
            debet_sub_schet: Joi.string().trim(),
            kredit_schet: Joi.string().trim(),
            kredit_sub_schet: Joi.string().trim(),
            data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
            iznos: Joi.boolean().required(),
            name: Joi.string().trim().required(),
            edin: Joi.string().trim().required(),
            inventar_num: Joi.string().trim(),
            serial_num: Joi.string().trim(),
            eski_iznos_summa: Joi.number().min(0).default(0)
          })
        )
      }),
      params: Joi.object({
        id: Joi.number().integer().min(1).required()
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        search: Joi.string().trim(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        main_schet_id: Joi.number().integer().min(1).required(),
        orderBy: Joi.string().trim().default('DESC').valid('ASC', 'DESC'),
        orderType: Joi.string().trim().default('doc_num').valid('doc_num', 'doc_date')
      })
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required()
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().min(1).required()
      }),
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }

  static report() {
    return Joi.object({
      query: Joi.object({
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        main_schet_id: Joi.number().integer().min(1).required()
      })
    }).options({ stripUnknown: true });
  }

  static import(lang) {
    return Joi.array().items(
      Joi.object({
        responsibleId: Joi.number().min(1).required().message({
          'number.base': lang('validation.kimgaName'),
          'any.required': lang('validation.kimgaName')
        }),
        groupId: Joi.number().required().message({
          'number.base': lang('validation.groupNumber'),
          'any.required': lang('validation.groupNumber')
        }),
        docDate: Joi.string().trim().pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/).required().message({
          'string.pattern.base': lang('validation.importDocDate'),
          'any.required': lang('validation.importDocDate')
        }),
        docNum: Joi.string().required().message({
          'any.required': lang('validation.docNum'),
          'string.base': lang('validation.docNum')
        }),
        organizationId: Joi.number().required().message({
          'number.base': lang('validation.organizationId'),
          'any.required': lang('validation.organizationId')
        }),
        productName: Joi.string().trim().required().message({
          'string.base': lang('validation.productName')
        }),
        edin: Joi.string().trim().required().message({
          'any.required': lang('validation.edin')
        }),
        
        
        
        
        
        serial_num: Joi.string().trim().allow(null, '').message({
          'string.base': lang('validation.serialNum')
        }),
        group_name: Joi.string().trim().required().message({
          'any.required': lang('validation.groupName')
        }),
        podraz_name: Joi.string().trim().required().message({
          'any.required': lang('validation.podrazName')
        }),
        name: Joi.string().trim().required().message({
          'any.required': lang('validation.name')
        }),
        kol: Joi.number().min(1).required().message({
          'number.min': lang('validation.kol'),
          'any.required': lang('validation.kol')
        }),
        summa: Joi.number().min(1).required().message({
          'number.min': lang('validation.summa'),
          'any.required': lang('validation.summa')
        }),
        debet_schet: Joi.any().required().message({
          'any.required': lang('validation.debetSchet')
        }),
        debet_sub_schet: Joi.any().required().message({
          'any.required': lang('validation.debetSubSchet')
        }),
        kredit_schet: Joi.any().message({
          'any.base': lang('validation.kreditSchet')
        }),
        kredit_sub_schet: Joi.any().message({
          'any.base': lang('validation.kreditSubSchet')
        }),
        iznos: Joi.boolean().required().message({
          'any.required': lang('validation.iznos'),
          'boolean.base': lang('validation.iznos')
        }),
        eski_iznos_summa: Joi.number().min(0).required().message({
          'number.min': lang('validation.eskiIznosSumma'),
          'any.required': lang('validation.eskiIznosSumma')
        }),
        yangi_iznos_summa: Joi.number().min(0).required().message({
          'number.min': lang('validation.yangiIznosSumma'),
          'any.required': lang('validation.yangiIznosSumma')
        }),
        osnovanie: Joi.string().trim().required().message({
          'any.required': lang('validation.osnovanie')
        }),
        shartnoma_num: Joi.string().trim().required().message({
          'any.required': lang('validation.shartnomaNum')
        }),
        shartnoma_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required().message({
          'string.pattern.base': lang('validation.shartnomaDate'),
          'any.required': lang('validation.shartnomaDate')
        }),
        prikaz_num: Joi.string().trim().required().message({
          'any.required': lang('validation.prikazNum')
        }),
        prikaz_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required().message({
          'string.pattern.base': lang('validation.prikazDate'),
          'any.required': lang('validation.prikazDate')
        }),
        komissiya_qaror: Joi.string().trim().allow(null, '').message({
          'string.base': lang('validation.komissiyaQaror')
        }),
        shartnoma_summa: Joi.number().min(1).required().message({
          'number.min': lang('validation.shartnomaSumma'),
          'any.required': lang('validation.shartnomaSumma')
        }),
        debet_schet_desc: Joi.string().trim().required().message({
          'any.required': lang('validation.debetSchetDesc')
        }),
        kredit_schet_desc: Joi.string().trim().allow(null, '').message({
          'string.base': lang('validation.kreditSchetDesc')
        }),
        moliyalashtirish_manzili: Joi.string().trim().required().message({
          'any.required': lang('validation.moliyalashtirishManzili')
        })
      })
    ).options({ stripUnknown: true });
  }

  static importSchema2() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().integer().min(1).required(),
        budjet_id: Joi.number().integer().min(1).required()
      })
    })
  }
}
