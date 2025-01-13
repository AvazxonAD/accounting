const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    getIznosSchema,
    updateIznosSchema,
    getByIdIznos
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.getIznos, getIznosSchema))
    .put('/:id', validator(Controller.updateIznos, updateIznosSchema))
    .get('/:id', validator(Controller.getByIdIznos, getByIdIznos));

module.exports = router;