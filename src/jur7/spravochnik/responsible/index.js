const { ResponsibleService } = require("./service");
const { Controller } = require('../../../helper/controller');
const {
    createResponsibleSchema,
    getResponsibleSchema,
    updateResponsibleSchema,
    getByIdResponsibleSchema,
    deleteResponsibleSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(ResponsibleService.createResponsible, createResponsibleSchema));
router.get('/:id', Controller(ResponsibleService.getByIdResponsible, getByIdResponsibleSchema));
router.put('/:id', Controller(ResponsibleService.updateResponsible, updateResponsibleSchema));
router.delete('/:id', Controller(ResponsibleService.deleteResponsible, deleteResponsibleSchema));
router.get('/', Controller(ResponsibleService.getResponsible, getResponsibleSchema));


module.exports = router;