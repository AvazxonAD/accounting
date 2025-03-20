const Joi = require("joi");

exports.MainBookSchema = class {
  static create() {
    return Joi.object({
      query: Joi.object({
        budjet_id: Joi.number().min(1).integer().required(),
      }),

      body: Joi.object({
        month: Joi.number().integer().required().min(1).max(12).required(),
        year: Joi.number().integer().required().min(1901).required(),
        childs: Joi.array().items(
          Joi.object({
            type: Joi.string().required(),
            sub_childs: Joi.array().items(
              Joi.object({
                schet: Joi.string(),
                prixod: Joi.number().min(0).required(),
                rasxod: Joi.number().min(0).required(),
              })
            ),
          })
        ),
      }),
    });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().min(1).integer().default(1),
        limit: Joi.number().min(1).integer().default(10),
      }),
    });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    });
  }
};
