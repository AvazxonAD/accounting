const { AktService } = require('./service');
const { validator } = require('../helper/validator');
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(AktService.createAkt, createSchema));
router.get('/:id', validator(AktService.getByIdAkt, getByIdSchema));
router.put('/:id', validator(AktService.updateAkt, updateSchema));
router.delete('/:id', validator(AktService.deleteAkt, deleteSchema));
router.get('/', validator(AktService.getAkt, getSchema));


module.exports = router;