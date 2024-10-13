const Joi = require('joi')

const queryValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10)
}).options({ stripUnknown: true });

const organizationMonitoringValidation = Joi.object({
    main_schet_id: Joi.number().required().min(1),
    limit: Joi.number().min(1).default(10),
    page: Joi.number().min(1).default(1),
    from: Joi.string().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    to: Joi.string().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
    spravochnik_organization_id: Joi.number().min(1).required()
}).options({ stripUnknown: true });


module.exports = { queryValidation, organizationMonitoringValidation }