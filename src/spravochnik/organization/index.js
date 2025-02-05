const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const { OrganizationSchema } = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.create, OrganizationSchema.create()))
    .get('/:id', validator(Controller.getById, OrganizationSchema.getById()))
    .put('/:id', validator(Controller.update, OrganizationSchema.update()))
    .delete('/:id', validator(Controller.delete, OrganizationSchema.delette()))
    .get('/', validator(Controller.get, OrganizationSchema.get()));


module.exports = router;