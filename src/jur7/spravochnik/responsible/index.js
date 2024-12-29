const { ResponsibleService } = require("./service");
const { validator } = require('../../../helper/validator');
const {
    createResponsibleSchema,
    getResponsibleSchema,
    updateResponsibleSchema,
    getByIdResponsibleSchema,
    deleteResponsibleSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(ResponsibleService.createResponsible, createResponsibleSchema));
router.get('/:id', validator(ResponsibleService.getByIdResponsible, getByIdResponsibleSchema));
router.put('/:id', validator(ResponsibleService.updateResponsible, updateResponsibleSchema));
router.delete('/:id', validator(ResponsibleService.deleteResponsible, deleteResponsibleSchema));
router.get('/', validator(ResponsibleService.getResponsible, getResponsibleSchema));


module.exports = router;