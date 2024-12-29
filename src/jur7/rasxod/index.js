const { RasxodService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    createRasxodSchema,
    getRasxodSchema,
    updateRasxodSchema,
    getByIdRasxodSchema,
    deleteRasxodSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(RasxodService.createRasxod, createRasxodSchema));
router.get('/:id', validator(RasxodService.getByIdRasxod, getByIdRasxodSchema));
router.put('/:id', validator(RasxodService.updateRasxod, updateRasxodSchema));
router.delete('/:id', validator(RasxodService.deleteRasxod, deleteRasxodSchema));
router.get('/', validator(RasxodService.getRasxod, getRasxodSchema));

module.exports = router;