const { Controller } = require("./controller");
const { validator } = require('../../../helper/validator');
const {
    getByIdNaimenovanieSchema,
    getNaimenovanieSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.getNaimenovanie, getNaimenovanieSchema));
router.get('/:id', validator(Controller.getByIdNaimenovanie, getByIdNaimenovanieSchema));

module.exports = router;