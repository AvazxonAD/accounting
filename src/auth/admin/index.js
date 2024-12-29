const { validator } = require('../../helper/validator');
const { AdminService } = require('./service')
const {
    createSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require('./schema');

const { Router } = require('express');
const router = Router();

router.post('/', validator(AdminService.createAdmin, createSchema))
    .get('/', validator(AdminService.getAdmin))
    .get('/:id', validator(AdminService.getByIdAdmin, getByIdSchema))
    .delete('/:id', validator(AdminService.deleteAdmin, deleteSchema))
    .put('/:id', validator(AdminService.updateAdmin, updateSchema))

module.exports = router;