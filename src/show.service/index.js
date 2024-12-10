const { ShowServiceService } = require('./service');
const { Controller } = require('../helper/controller');
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(ShowServiceService.createShowService, createSchema));
router.get('/:id', Controller(ShowServiceService.getByIdShowService, getByIdSchema));
router.put('/:id', Controller(ShowServiceService.updateShowService, updateSchema));
router.delete('/:id', Controller(ShowServiceService.deleteShowService, deleteSchema));
router.get('/', Controller(ShowServiceService.getShowService, getSchema));

module.exports = router;