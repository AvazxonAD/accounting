const { EndService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    getEndSchema,
    updateEndSchema,
    getByIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/:id', validator(EndService.getByIdEnd, getByIdSchema))
    .get('/', validator(EndService.getEnd, getEndSchema))
    .put('/:id', validator(EndService.updateEnd, updateEndSchema));


module.exports = router;