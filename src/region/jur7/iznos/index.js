const { Controller } = require('./controller');
const { validator } = require('@helper/validator');
const { IznosSchema } = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.get, IznosSchema.get()))
    .post('/', validator(Controller.create, IznosSchema.create()))
    .put('/:id', validator(Controller.updateIznos, IznosSchema.update()))
    .get('/:id', validator(Controller.getByIdIznos, IznosSchema.getById()));

module.exports = router;