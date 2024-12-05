const { UnitService } = require("./service");
const { Controller } = require('../../../helper/controller');
const {
    createUnitSchema,
    getUnitSchema,
    updateUnitSchema,
    getByIdUnitSchema,
    deleteUnitSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(UnitService.createUnit, createUnitSchema));
router.get('/:id', Controller(UnitService.getByIdUnit, getByIdUnitSchema));
router.put('/:id', Controller(UnitService.updateUnit, updateUnitSchema));
router.delete('/:id', Controller(UnitService.deleteUnit, deleteUnitSchema));
router.get('/', Controller(UnitService.getUnit, getUnitSchema));


module.exports = router;