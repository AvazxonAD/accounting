const { Controller } = require("./controller");
const { validator } = require('@helper/validator');
const {
    getByIdNaimenovanieSchema,
    getNaimenovanieSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.get, getNaimenovanieSchema));
router.get('/:id', validator(Controller.getById, getByIdNaimenovanieSchema));

module.exports = router;