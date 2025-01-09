const { Controller } = require('./controller');
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

router.get('/report', validator(Controller.getPrixodReport, getPrixodReport));
router.post('/', validator(Controller.createPrixod, createPrixodSchema));
router.get('/:id', validator(Controller.getByIdPrixod, getByIdPrixodSchema));
router.put('/:id', validator(Controller.updatePrixod, updatePrixodSchema));
router.delete('/:id', validator(Controller.deletePrixod, deletePrixodSchema));
router.get('/', validator(Controller.getPrixod, getPrixodSchema));


module.exports = router;