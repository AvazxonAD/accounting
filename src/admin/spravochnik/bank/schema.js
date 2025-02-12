const Joi = require('joi')

exports.createBankSchema = Joi.object({
  body : Joi.object({
    bank_name: Joi.string().trim().required(),
    mfo: Joi.string().trim().required()
  })
}).options({ stripUnknown: true });

exports.updateBankSchema = Joi.object({
  body: Joi.object({
    bank_name: Joi.string().trim().required(),
    mfo: Joi.string().trim().required()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
})

exports.getBankSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.getByIdBankSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deleteBankSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });