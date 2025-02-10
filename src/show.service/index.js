const { Controller } = require('./controller');
const { validator } = require('../helper/validator');
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createShowService, createSchema));
router.get('/:id', validator(Controller.getByIdShowService, getByIdSchema));
router.put('/:id', validator(Controller.updateShowService, updateSchema));
router.delete('/:id', validator(Controller.deleteShowService, deleteSchema));
router.get('/', validator(Controller.getShowService, getSchema));

module.exports = router;