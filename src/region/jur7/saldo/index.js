const { Router } = require('express');
const router = Router();

const { Controller } = require('./controller');
const { validator } = require('@helper/validator');

const {
    createSaldoSchema,
    getSaldoSchema,
    getSaldoRasxodSchema
} = require("./schema");


router.post('/', validator(Controller.createSaldo, createSaldoSchema))
    .get('/', validator(Controller.getSaldo, getSaldoSchema));

module.exports = router;