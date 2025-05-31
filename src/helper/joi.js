const JoiBase = require("joi");

exports.Joi = JoiBase.defaults((schema) => {
  return schema.options({ stripUnknown: true, abortEarly: false, allowUnknown: false, convert: true });
});
