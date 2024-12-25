const { EndService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    getEndSchema,
    updateEndSchema,
    getByIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/:id', Controller(EndService.getByIdEnd, getByIdSchema))
    .get('/', Controller(EndService.getEnd, getEndSchema))
    .put('/:id', Controller(EndService.updateEnd, updateEndSchema));


module.exports = router;