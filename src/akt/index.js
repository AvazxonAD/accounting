const { Controller } = require('./controller');
const { validator } = require('../helper/validator');
const {
    createSchema,
    getSchema,
    updateSchema,
    getByIdSchema,
    deleteSchema,
    capSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createAkt, createSchema));
router.get('/export/cap', validator(Controller.cap, capSchema));
router.get('/:id', validator(Controller.getByIdAkt, getByIdSchema));
router.put('/:id', validator(Controller.updateAkt, updateSchema));
router.delete('/:id', validator(Controller.deleteAkt, deleteSchema));
router.get('/', validator(Controller.getAkt, getSchema));


module.exports = router;