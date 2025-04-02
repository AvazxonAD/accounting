const { Controller } = require('./controller');
const { validator } = require('@helper/validator');
const { AktSchema } = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.create, AktSchema.create()));
router.get('/:id', validator(Controller.getById, AktSchema.getById()));
router.put('/:id', validator(Controller.update, AktSchema.update()));
router.delete('/:id', validator(Controller.delete, AktSchema.delete()));
router.get('/', validator(Controller.get, AktSchema.get()));


module.exports = router;