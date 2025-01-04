const { Controller } = require('./controllers');
const { validator } = require('../helper/validator');
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema,
    sendSchema
} = require("./schemas");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createDoc, createSchema))
    .get('/:id', validator(Controller.getByIdDoc, getByIdSchema))
    .put('/send/:id', validator(Controller.sendDoc, sendSchema))
    .put('/:id', validator(Controller.updateDoc, updateSchema))
    .delete('/:id', validator(Controller.deleteDoc, deleteSchema))
    .get('/', validator(Controller.getDoc, getSchema));


module.exports = router;