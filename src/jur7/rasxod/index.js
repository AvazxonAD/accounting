const { RasxodService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    createRasxodSchema,
    getRasxodSchema,
    updateRasxodSchema,
    getByIdRasxodSchema,
    deleteRasxodSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(RasxodService.createRasxod, createRasxodSchema));
router.get('/:id', Controller(RasxodService.getByIdRasxod, getByIdRasxodSchema));
router.put('/:id', Controller(RasxodService.updateRasxod, updateRasxodSchema));
router.delete('/:id', Controller(RasxodService.deleteRasxod, deleteRasxodSchema));
router.get('/', Controller(RasxodService.getRasxod, getRasxodSchema));


module.exports = router;