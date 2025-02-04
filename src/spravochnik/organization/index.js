const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    createSchema,
    getSchema,
    updateOrganizationSchema,
    getByIdOrganizationSchema,
    deleteOrganizationSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.create, createSchema));
router.get('/:id', validator(Controller.getById, getByIdOrganizationSchema));
router.put('/:id', validator(Controller.update, updateOrganizationSchema));
router.delete('/:id', validator(Controller.delete, deleteOrganizationSchema));
router.get('/', validator(Controller.get, getSchema));


module.exports = router;