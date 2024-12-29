const { PrixodService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    createPrixodSchema,
    getPrixodSchema,
    updatePrixodSchema,
    getByIdPrixodSchema,
    deletePrixodSchema,
    getPrixodReport
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/report', validator(PrixodService.getPrixodReport, getPrixodReport));
router.post('/', validator(PrixodService.createPrixod, createPrixodSchema));
router.get('/:id', validator(PrixodService.getByIdPrixod, getByIdPrixodSchema));
router.put('/:id', validator(PrixodService.updatePrixod, updatePrixodSchema));
router.delete('/:id', validator(PrixodService.deletePrixod, deletePrixodSchema));
router.get('/', validator(PrixodService.getPrixod, getPrixodSchema));


module.exports = router;