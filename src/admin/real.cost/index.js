const { Controller } = require('./constrollers');
const { validator } = require('../../helper/validator');
const {
    getEndSchema,
    updateEndSchema,
    getByIdSchema
} = require("./schemas");

const { Router } = require('express')
const router = Router()

router.get('/:id', validator(Controller.getByIdEnd, getByIdSchema))
    .get('/', validator(Controller.getEnd, getEndSchema))
    .put('/:id', validator(Controller.updateEnd, updateEndSchema));


module.exports = router;