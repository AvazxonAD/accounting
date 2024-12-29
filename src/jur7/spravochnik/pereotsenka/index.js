const { PereotsenkaService } = require("./service");
const { validator } = require('../../../helper/validator');
const {
    createPereotsenkaSchema,
    getPereotsenkaSchema,
    updatePereotsenkaSchema,
    getByIdPereotsenkaSchema,
    deletePereotsenkaSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(PereotsenkaService.createPereotsenka, createPereotsenkaSchema));
router.get('/:id', validator(PereotsenkaService.getByIdPereotsenka, getByIdPereotsenkaSchema));
router.put('/:id', validator(PereotsenkaService.updatePereotsenka, updatePereotsenkaSchema));
router.delete('/:id', validator(PereotsenkaService.deletePereotsenka, deletePereotsenkaSchema));
router.get('/', validator(PereotsenkaService.getPereotsenka, getPereotsenkaSchema));


module.exports = router;