const { EndService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    createEndSchema,
    getEndSchema,
    updateEndSchema,
    getInfoEndSchema,
    deleteEndSchema,
    getByIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(EndService.createEnd, createEndSchema))
    .get('/info', validator(EndService.getInfo, getInfoEndSchema))
    .get('/:id', validator(EndService.getByIdEnd, getByIdSchema))
    .get('/', validator(EndService.getEnd, getEndSchema))
    .put('/:id', validator(EndService.updateEnd, updateEndSchema))
    .delete('/:id', validator(EndService.deleteEnd, deleteEndSchema));


module.exports = router;