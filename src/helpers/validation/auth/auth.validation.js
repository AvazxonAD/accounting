const Joi = require("joi");

const authValidation = Joi.object({
    login: Joi.string().required(), 
    password: Joi.string().required(), 
    main_schet_id: Joi.number()
});

module.exports = {
    authValidation,
};
