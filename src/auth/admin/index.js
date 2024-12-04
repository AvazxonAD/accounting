const { Controller } = require('../../helper/controller');
const { AdminService } = require('./service')
const {
    createSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require('./schema');

const { Router } = require('express');
const router = Router();

router.post('/', Controller(AdminService.createAdmin, createSchema))
    .get('/', Controller(AdminService.getAdmin))
    .get('/:id', Controller(AdminService.getByIdAdmin, getByIdSchema))
    .delete('/:id', Controller(AdminService.deleteAdmin, deleteSchema))
    .put('/:id', Controller(AdminService.updateAdmin, updateSchema))

module.exports = router;