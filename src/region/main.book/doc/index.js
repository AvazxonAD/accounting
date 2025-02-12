const { Controller } = require('./controller');
const { validator } = require('@helper/validator');
const {
    createDocSchema,
    getDocSchema,
    updateDocSchema,
    getByIdDocSchema,
    deleteDocSchema,
    getBySchetSchema,
    DocSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createDoc, createDocSchema))
    .get('/id', validator(Controller.getByIdDoc, getByIdDocSchema))
    .put('/', validator(Controller.updateDoc, updateDocSchema))
    .delete('/', validator(Controller.deleteDoc, deleteDocSchema))
    .get('/by/schet', validator(Controller.getBySchetSumma, getBySchetSchema))
    .get('/auto', validator(Controller.auto, DocSchema.auto()))
    .get('/', validator(Controller.getDoc, getDocSchema));


module.exports = router;