const { Controller } = require('../../helper/controller');
const { UserService } = require('./service')
const {
    createSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require('./schema');

const { Router } = require('express');
const router = Router();

router.post('/', Controller(UserService.createUser, createSchema))
    .get('/', Controller(UserService.getUser))
    .get('/:id', Controller(UserService.getByIdUser, getByIdSchema))
    .delete('/:id', Controller(UserService.deleteUser, deleteSchema))
    .put('/:id', Controller(UserService.updateUser, updateSchema))

module.exports = router;