const Joi = require('joi')

exports.createRasxodSchema = Joi.object({
  body: Joi.object({
    doc_num: Joi.string().trim(),
    doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    j_o_num: Joi.string().trim(),
    opisanie: Joi.string().trim(),
    doverennost: Joi.string().trim(),
    kimdan_id: Joi.number().integer().min(1).required(),
    kimga_id: Joi.number().integer().min(1).required(),
    kimga_name: Joi.string().trim(),
    kimdan_name: Joi.string().trim(),
    childs: Joi.array().required().items(
      Joi.object({
        naimenovanie_tovarov_jur7_id: Joi.number().required(),
        kol: Joi.number().min(1).required(),
        sena: Joi.number().min(1).required(),
        debet_schet: Joi.string().trim(),
        debet_sub_schet: Joi.string().trim(),
        kredit_schet: Joi.string().trim(),
        kredit_sub_schet: Joi.string().trim(),
        data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      })
    )
  }),
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.updateRasxodSchema = Joi.object({
  body: Joi.object({
    doc_num: Joi.string().trim(),
    doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    j_o_num: Joi.string().trim(),
    opisanie: Joi.string().trim(),
    doverennost: Joi.string().trim(),
    kimdan_id: Joi.number().integer().min(1).required(),
    kimga_id: Joi.number().integer().min(1).required(),
    kimga_name: Joi.string().trim(),
    kimdan_name: Joi.string().trim(),
    childs: Joi.array().required().items(
      Joi.object({
        naimenovanie_tovarov_jur7_id: Joi.number().required(),
        kol: Joi.number().min(1).required(),
        sena: Joi.number().min(1).required(),
        debet_schet: Joi.string().trim(),
        debet_sub_schet: Joi.string().trim(),
        kredit_schet: Joi.string().trim(),
        kredit_sub_schet: Joi.string().trim(),
        data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      })
    )
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  }),
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getRasxodSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim(),
    from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.getByIdRasxodSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  }),
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteRasxodSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  }),
  query: Joi.object({
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });