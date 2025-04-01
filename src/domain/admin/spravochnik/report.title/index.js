const { Controller } = require("./controller");
const { validator } = require('@helper/validator');
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.create, createSchema))
    .get('/:id', validator(Controller.getById, getByIdSchema))
    .put('/:id', validator(Controller.update, updateSchema))
    .delete('/:id', validator(Controller.delete, deleteSchema))
    .get('/', validator(Controller.get, getSchema));


module.exports = router;