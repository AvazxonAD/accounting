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
        id_shartnomalar_organization: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
        organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
        shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
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
        responsibleId: Joi.number().min(1).required().messages({ '*': lang.t('validation.responsibleId') }),
        groupId: Joi.number().required().messages({ '*': lang.t('validation.groupNumber') }),
        docDate: Joi.string().trim().pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/).required().messages({ '*': lang.t('validation.importDocDate') }),
        docNum: Joi.number().required().messages({ '*': lang.t('validation.docNum') }),
        organizationId: Joi.number().required().messages({ '*': lang.t('validation.organizationId') }),
        productName: Joi.string().trim().required().messages({ '*': lang.t('validation.productName') }),
        edin: Joi.string().trim().required().messages({ '*': lang.t('validation.edin') }),
        kol: Joi.number().min(1).required().messages({ '*': lang.t('validation.kol') }),
        summa: Joi.number().min(1).required().messages({ '*': lang.t('validation.summa') }),
        inventarNum: Joi.any().messages({ '*': lang.t('validation.inventarNum') }),
        serialNum: Joi.any().messages({ '*': lang.t('validation.serialNum') }),
        debetSchet: Joi.any().messages({ '*': lang.t('validation.debetSchet') }),
        debetSubSchet: Joi.any().required().messages({ '*': lang.t('validation.debetSubSchet') }),
        kreditSchet: Joi.any().messages({ '*': lang.t('validation.kreditSchet') }),
        kreditSubSchet: Joi.any().messages({ '*': lang.t('validation.kreditSubSchet') }),
        iznos: Joi.any().messages({ '*': lang.t('validation.iznos') }),
        ndsFoiz: Joi.number().min(0).max(99).messages({ '*': lang.t('validation.ndsFoiz') }),
        eskiIznosSumma: Joi.number().min(0).default(0).messages({ '*': lang.t('validation.eskiIznosSumma') })
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
