const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const { InternalSchema } = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.create, InternalSchema.create()))
    .get('/:id', validator(Controller.getById, InternalSchema.getById()))
    .put('/:id', validator(Controller.update, InternalSchema.update()))
    .delete('/:id', validator(Controller.delete, InternalSchema.delete()))
    .get('/', validator(Controller.get, InternalSchema.get()));

module.exports = router;