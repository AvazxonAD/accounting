const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    createDocSchema,
    getDocSchema,
    updateDocSchema,
    getByIdDocSchema,
    deleteDocSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createDoc, createDocSchema))
    .get('/operatsii', validator(Controller.getOperatsiiMainBook))
    .get('/:id', validator(Controller.getByIdDoc, getByIdDocSchema))
    .put('/:id', validator(Controller.updateDoc, updateDocSchema))
    .delete('/:id', validator(Controller.deleteDoc, deleteDocSchema))
    .get('/', validator(Controller.getDoc, getDocSchema));


module.exports = router;