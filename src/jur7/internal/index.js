const { InternalService } = require('./service');
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

router.post('/', validator(InternalService.createInternal, createInternalSchema));
router.get('/:id', validator(InternalService.getByIdInternal, getByIdInternalSchema));
router.put('/:id', validator(InternalService.updateInternal, updateInternalSchema));
router.delete('/:id', validator(InternalService.deleteInternal, deleteInternalSchema));
router.get('/', validator(InternalService.getInternal, getInternalSchema));


module.exports = router;