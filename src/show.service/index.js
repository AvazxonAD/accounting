const { ShowServiceService } = require('./service');
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

router.post('/', validator(ShowServiceService.createShowService, createSchema));
router.get('/:id', validator(ShowServiceService.getByIdShowService, getByIdSchema));
router.put('/:id', validator(ShowServiceService.updateShowService, updateSchema));
router.delete('/:id', validator(ShowServiceService.deleteShowService, deleteSchema));
router.get('/', validator(ShowServiceService.getShowService, getSchema));

module.exports = router;