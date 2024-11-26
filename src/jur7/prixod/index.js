const { PrixodService } = require("./service");
const { Controller } = require('../../helper/controller');
const {
    createPrixodSchema,
    getPrixodSchema,
    updatePrixodSchema,
    getByIdPrixodSchema,
    deletePrixodSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(PrixodService.createPrixod, createPrixodSchema));
router.get('/:id', Controller(PrixodService.getByIdPrixod, getByIdPrixodSchema));
router.put('/:id', Controller(PrixodService.updatePrixod, updatePrixodSchema));
router.delete('/:id', Controller(PrixodService.deletePrixod, deletePrixodSchema));
router.get('/', Controller(PrixodService.getPrixod, getPrixodSchema));


module.exports = router;