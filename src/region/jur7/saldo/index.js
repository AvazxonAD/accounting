const { Router } = require('express');
const router = Router();

const { Controller } = require('./controller');
const { validator } = require('@helper/validator');

const {
    createSaldoSchema,
    getSaldoSchema,
    SaldoSchema
} = require("./schema");


router.post('/', validator(Controller.create, SaldoSchema.create()))
    .get('/temlate', Controller.templateFile)
    .get('/', validator(Controller.getSaldo, getSaldoSchema));

module.exports = router;