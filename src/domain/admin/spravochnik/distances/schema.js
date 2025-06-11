const Joi = require("joi");

exports.DistancesSchema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        from_district_id: Joi.number().integer().min(1).required(),
        to_district_id: Joi.number().integer().min(1).required(),
        distance_km: Joi.number().min(1).max(999999.99).precision(2).positive().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        distance_km: Joi.number().min(1).max(999999.99).precision(2).positive().required(),
      }),

      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().min(1).integer().default(1),
        limit: Joi.number().min(1).integer().default(100),
        from_district_id: Joi.number().integer().min(1),
        to_district_id: Joi.number().integer().min(1),
        search: Joi.string().trim(),
      }),
    }).options({ stripUnknown: true });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    }).options({ stripUnknown: true });
  }
};
