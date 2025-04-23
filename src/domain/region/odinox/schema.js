const Joi = require("joi");

exports.OdinoxSchema = class {
  static create() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
      }),

      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        childs: Joi.array()
          .items(
            Joi.object({
              type_id: Joi.number().integer().min(1).required(),
              sub_childs: Joi.array()
                .items(
                  Joi.object({
                    smeta_id: Joi.number().integer().required().min(1),
                    summa: Joi.number().min(0).required(),
                  })
                )
                .min(1)
                .required(),
            })
          )
          .min(1)
          .required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getSmeta() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
        year: Joi.number().integer().required().min(1901).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getData() {
    return Joi.object({
      query: Joi.object({
        main_schet_id: Joi.number().min(1).integer().required(),
        month: Joi.number().min(1).integer().max(12).required(),
        year: Joi.number().min(1901).integer().max(2099).required(),
      }),
    }).options({ stripUnknown: true });
  }
};
