const { EndService } = require('./service');
const { Controller } = require('../../helper/controller');
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

router.post('/', Controller(EndService.createEnd, createEndSchema))
    .get('/info', Controller(EndService.getInfo, getInfoEndSchema))
    .get('/:id', Controller(EndService.getByIdEnd, getByIdSchema))
    .get('/', Controller(EndService.getEnd, getEndSchema))
    .put('/:id', Controller(EndService.updateEnd, updateEndSchema))
    .delete('/:id', Controller(EndService.deleteEnd, deleteEndSchema));


module.exports = router;