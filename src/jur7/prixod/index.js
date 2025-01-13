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

router.get('/report', validator(Controller.getPrixodReport, getPrixodReport))
    .post('/', validator(Controller.createPrixod, createPrixodSchema))
    .get('/:id', validator(Controller.getByIdPrixod, getByIdPrixodSchema))
    .put('/:id', validator(Controller.updatePrixod, updatePrixodSchema))
    .delete('/:id', validator(Controller.deletePrixod, deletePrixodSchema))
    .get('/', validator(Controller.getPrixod, getPrixodSchema));


module.exports = router;