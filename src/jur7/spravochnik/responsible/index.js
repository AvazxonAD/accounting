const { Controller } = require("./controller");
const { validator } = require('../../../helper/validator');
const {
    createResponsibleSchema,
    getResponsibleSchema,
    updateResponsibleSchema,
    getByIdResponsibleSchema,
    deleteResponsibleSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createResponsible, createResponsibleSchema));
router.get('/:id', validator(Controller.getById, getByIdResponsibleSchema));
router.put('/:id', validator(Controller.updateResponsible, updateResponsibleSchema));
router.delete('/:id', validator(Controller.deleteResponsible, deleteResponsibleSchema));
router.get('/', validator(Controller.getResponsible, getResponsibleSchema));


module.exports = router;