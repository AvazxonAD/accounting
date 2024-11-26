exports.getByIdPodotchetSchema = Joi.object({
    query: Joi.object({
        main_schet_id: Joi.number().integer().required().min(1),
        limit: Joi.number().min(1).default(10),
        page: Joi.number().min(1).default(1),
        from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        operatsii: Joi.string().trim().required()
    }),
    params: Joi.object({
        id: Joi.number().integer().min(1)
    })
}).options({ stripUnknown: true });