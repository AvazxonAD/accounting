const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    getIznosSchema,
    updateIznosSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.getIznos, getIznosSchema))
    .put('/:id', validator(Controller.updateIznos, updateIznosSchema));

module.exports = router;