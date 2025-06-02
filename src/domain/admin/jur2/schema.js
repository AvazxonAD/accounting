const { Joi } = require(`@helper/joi`);

exports.Jur2MonitoringSchema = class {
  static get() {
    return Joi.object({
      query: Joi.object({
        to: Joi.string()
          .trim()
          .pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
          .required(),
        search: Joi.string().trim().allow("", null),
      }),
    });
  }
};
