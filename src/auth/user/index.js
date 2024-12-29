const { validator } = require('../../helper/validator');
const { UserService } = require('./service')
const {
    createSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require('./schema');

const { Router } = require('express');
const router = Router();

router.post('/', validator(UserService.createUser, createSchema))
    .get('/', validator(UserService.getUser))
    .get('/:id', validator(UserService.getByIdUser, getByIdSchema))
    .delete('/:id', validator(UserService.deleteUser, deleteSchema))
    .put('/:id', validator(UserService.updateUser, updateSchema))

module.exports = router;