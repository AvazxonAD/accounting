const { PereotsenkaService } = require("./service");
const { Controller } = require('../../helper/controller');
const {
    createPereotsenkaSchema,
    getPereotsenkaSchema,
    updatePereotsenkaSchema,
    getByIdPereotsenkaSchema,
    deletePereotsenkaSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(PereotsenkaService.createPereotsenka, createPereotsenkaSchema));
router.get('/:id', Controller(PereotsenkaService.getByIdPereotsenka, getByIdPereotsenkaSchema));
router.put('/:id', Controller(PereotsenkaService.updatePereotsenka, updatePereotsenkaSchema));
router.delete('/:id', Controller(PereotsenkaService.deletePereotsenka, deletePereotsenkaSchema));
router.get('/', Controller(PereotsenkaService.getPereotsenka, getPereotsenkaSchema));


module.exports = router;