const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    createInternalSchema,
    getInternalSchema,
    updateInternalSchema,
    getByIdInternalSchema,
    deleteInternalSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createInternal, createInternalSchema));
router.get('/:id', validator(Controller.getByIdInternal, getByIdInternalSchema));
router.put('/:id', validator(Controller.updateInternal, updateInternalSchema));
router.delete('/:id', validator(Controller.deleteInternal, deleteInternalSchema));
router.get('/', validator(Controller.getInternal, getInternalSchema));

module.exports = router;