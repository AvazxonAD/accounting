const { Controller } = require('../../helper/controller');
const { RoleService } = require('./service')
const {
    createSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require('./schema');

const { Router } = require('express');
const router = Router();

router.post('/', Controller(RoleService.createRole, createSchema))
    .get('/', Controller(RoleService.getRole))
    .get('/:id', Controller(RoleService.getByIdRole, getByIdSchema))
    .delete('/:id', Controller(RoleService.deleteRole, deleteSchema))
    .put('/:id', Controller(RoleService.updateRole, updateSchema))

module.exports = router;