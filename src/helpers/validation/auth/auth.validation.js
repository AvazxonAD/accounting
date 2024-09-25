const Joi = require("joi");

const authValidation = Joi.object({
    login: Joi.string().required(), 
    password: Joi.string().required(), 
    main_schet_id: Joi.number()
});

const authUpdateValidation = Joi.object({
    fio: Joi.string().required(),
    login: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
})

module.exports = {
    authValidation,
    authUpdateValidation
};
