const { Router } = require('express');
const router = Router();

const { Controller } = require('./controller');
const { validator } = require('@helper/validator');

const { SaldoSchema } = require("./schema");

const upload = require('@helper/upload');
const { Middleware } = require('@middleware/index');

router
    .post('/import', Middleware.jur7Block, upload.single('file'), validator(Controller.import, SaldoSchema.import()))
    .post('/', validator(Controller.create, SaldoSchema.create()))
    .put('/iznos_summa/:id', validator(Controller.updateIznosSumma, SaldoSchema.updateIznosSumma()))
    .get('/temlate', Middleware.jur7Block, Controller.templateFile)
    .get('/check', validator(Controller.check, SaldoSchema.check()))
    .get('/:id', validator(Controller.getById, SaldoSchema.getById()))
    .get('/', Middleware.jur7Block, validator(Controller.get, SaldoSchema.get()));

module.exports = router;