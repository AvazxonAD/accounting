const { Controller } = require('./controller');
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

router.post('/', validator(Controller.createRasxod, createRasxodSchema));
router.get('/:id', validator(Controller.getByIdRasxod, getByIdRasxodSchema));
router.put('/:id', validator(Controller.updateRasxod, updateRasxodSchema));
router.delete('/:id', validator(Controller.deleteRasxod, deleteRasxodSchema));
router.get('/', validator(Controller.getRasxod, getRasxodSchema));

module.exports = router;