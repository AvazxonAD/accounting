const { AktService } = require('./service');
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

router.post('/', Controller(AktService.createAkt, createSchema));
router.get('/:id', Controller(AktService.getByIdAkt, getByIdSchema));
router.put('/:id', Controller(AktService.updateAkt, updateSchema));
router.delete('/:id', Controller(AktService.deleteAkt, deleteSchema));
router.get('/', Controller(AktService.getAkt, getSchema));


module.exports = router;