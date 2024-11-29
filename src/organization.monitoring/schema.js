const Joi = require('joi')

exports.getMonitoringSchema = Joi.object({
    query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        operatsii: Joi.string().required(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
    })
  }).options({ stripUnknown: true });

  exports.getByOrganizationIdMonitoringSchema = Joi.object({
    query: Joi.object({
        main_schet_id: Joi.number().required().min(1),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        operatsii: Joi.string().required(),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
    }),
    params: {
        
    }
  }).options({ stripUnknown: true });