const Joi = require('joi')


exports.PodrazSchema = class {
  static import() {
      return Joi.object({
          file: Joi.object({
              path: Joi.string().trim().required()
          })       
      })
  }
}

exports.createPodrazdelenieSchema = Joi.object({
  body : Joi.object({
    name: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.updatePodrazdelenieSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
})

exports.getPodrazdelenieSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().trim()
  })
}).options({ stripUnknown: true });

exports.getByIdPodrazdelenieSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });

exports.deletePodrazdelenieSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({ stripUnknown: true });