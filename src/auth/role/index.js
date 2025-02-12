const { validator } = require('@helper/validator');
const { RoleService } = require('./service')
const {
    createSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require('./schema');

const { Router } = require('express');
const router = Router();

router.post('/', validator(RoleService.createRole, createSchema))
    .get('/', validator(RoleService.getRole))
    .get('/:id', validator(RoleService.getByIdRole, getByIdSchema))
    .delete('/:id', validator(RoleService.deleteRole, deleteSchema))
    .put('/:id', validator(RoleService.updateRole, updateSchema))

module.exports = router;