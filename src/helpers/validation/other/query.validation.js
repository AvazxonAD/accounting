const Joi = require('joi')

const queryValidation = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10)
})

module.exports = {queryValidation}