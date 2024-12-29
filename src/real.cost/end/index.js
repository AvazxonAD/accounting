const { Controller } = require('./controllers');
const { validator } = require('../../helper/validator');
const {
    createEndSchema,
    getEndSchema,
    updateEndSchema,
    getInfoEndSchema,
    deleteEndSchema,
    getByIdSchema
} = require("./schemas");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createEnd, createEndSchema))
    .get('/info', validator(Controller.getInfo, getInfoEndSchema))
    .get('/:id', validator(Controller.getByIdEnd, getByIdSchema))
    .get('/', validator(Controller.getEnd, getEndSchema))
    .put('/:id', validator(Controller.updateEnd, updateEndSchema))
    .delete('/:id', validator(Controller.deleteEnd, deleteEndSchema));


module.exports = router;