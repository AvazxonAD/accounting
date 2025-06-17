const Joi = require("joi");

exports.WorkerTripSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim().required(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        from_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        day_summa: Joi.number().min(0).required(),
        hostel_ticket_number: Joi.string().trim().required(),
        hostel_summa: Joi.number().min(0).required(),
        from_region_id: Joi.number().min(1).integer().required(),
        to_region_id: Joi.number().min(1).integer().required(),
        road_ticket_number: Joi.string().trim().allow(null, ""),
        road_summa: Joi.number().min(0).required(),
        summa: Joi.number().min(0).required(),
        comment: Joi.string().max(1000).trim().allow(null, ""),
        worker_id: Joi.number().min(1).integer().required(),
        childs: Joi.array()
          .items(
            Joi.object({
              schet_id: Joi.number().min(1).required(),
              summa: Joi.number().required(),
              type: Joi.string().valid("hostel", "day", "road").required(),
            })
          )
          .min(1)
          .required(),
      }),
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
        schet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        doc_num: Joi.string().trim().required(),
        doc_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        from_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to_date: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        day_summa: Joi.number().min(0).required(),
        hostel_ticket_number: Joi.string().trim().required(),
        hostel_summa: Joi.number().min(0).required(),
        from_region_id: Joi.number().min(1).integer().required(),
        to_region_id: Joi.number().min(1).integer().required(),
        road_ticket_number: Joi.string().trim().allow(null, ""),
        road_summa: Joi.number().min(0).required(),
        summa: Joi.number().min(0).required(),
        comment: Joi.string().max(1000).trim().allow(null, ""),
        worker_id: Joi.number().min(1).integer().required(),
        childs: Joi.array()
          .items(
            Joi.object({
              schet_id: Joi.number().min(1).required(),
              summa: Joi.number().required(),
              type: Joi.string().valid("hostel", "day", "road").required(),
            })
          )
          .min(1)
          .required(),
      }),
      query: Joi.object({
        schet_id: Joi.number().min(1).integer().required(),
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        schet_id: Joi.number().min(1).integer().required(),
        main_schet_id: Joi.number().required().min(1).integer(),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        search: Joi.string().trim().allow(null, ""),
        from: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        order_by: Joi.string().trim().default("doc_date").valid("doc_num", "doc_date", "id"),
        order_type: Joi.string().trim().allow(null, "").default("DESC").valid("ASC", "DESC"),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
      query: Joi.object({
        schet_id: Joi.number().min(1).integer().required(),
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
      query: Joi.object({
        schet_id: Joi.number().min(1).integer().required(),
        main_schet_id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
