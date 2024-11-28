const { InternalService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    createInternalSchema,
    getInternalSchema,
    updateInternalSchema,
    getByIdInternalSchema,
    deleteInternalSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(InternalService.createInternal, createInternalSchema));
router.get('/:id', Controller(InternalService.getByIdInternal, getByIdInternalSchema));
router.put('/:id', Controller(InternalService.updateInternal, updateInternalSchema));
router.delete('/:id', Controller(InternalService.deleteInternal, deleteInternalSchema));
router.get('/', Controller(InternalService.getInternal, getInternalSchema));


module.exports = router;