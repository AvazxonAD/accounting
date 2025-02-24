const { Router } = require('express');
const router = Router();

const { Controller } = require('./controller');
const { validator } = require('@helper/validator');

const { getSaldoSchema, SaldoSchema } = require("./schema");

const upload = require('../../../helper/upload');

router
    .post('/import', upload.single('file'), validator(Controller.import, SaldoSchema.import()))
    .get('/temlate', Controller.templateFile)
    .delete('/:product_id', validator(Controller.delete, SaldoSchema.delete()))
    .get('/', validator(Controller.getSaldo, getSaldoSchema));

module.exports = router;