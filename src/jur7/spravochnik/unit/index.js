const { UnitService } = require("./service");
const { validator } = require('../../../helper/validator');
const {
    createUnitSchema,
    getUnitSchema,
    updateUnitSchema,
    getByIdUnitSchema,
    deleteUnitSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(UnitService.createUnit, createUnitSchema));
router.get('/:id', validator(UnitService.getByIdUnit, getByIdUnitSchema));
router.put('/:id', validator(UnitService.updateUnit, updateUnitSchema));
router.delete('/:id', validator(UnitService.deleteUnit, deleteUnitSchema));
router.get('/', validator(UnitService.getUnit, getUnitSchema));


module.exports = router;