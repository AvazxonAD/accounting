const { validator } = require('@helper/validator');
const { RoleService } = require('./service')
const {
    createSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema,
    RoleSchema
} = require('./schema');

const { Router } = require('express');
const router = Router();

router.post('/', validator(RoleService.createRole, createSchema))
    .get('/', validator(RoleService.getRole, RoleSchema.get()))
    .get('/:id', validator(RoleService.getByIdRole, getByIdSchema))
    .delete('/:id', validator(RoleService.deleteRole, deleteSchema))
    .put('/:id', validator(RoleService.updateRole, updateSchema))

module.exports = router;