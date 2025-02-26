const { Router } = require('express');
const router = Router();

const { Controller } = require('./controller');
const { validator } = require('@helper/validator');

const { SaldoSchema } = require("./schema");

const upload = require('../../../helper/upload');

router
    .post('/import', upload.single('file'), validator(Controller.import, SaldoSchema.import()))
    .post('/', validator(Controller.create, SaldoSchema.create()))
    .get('/temlate', Controller.templateFile)
    .get('/check', validator(Controller.check, SaldoSchema.check()))
    .get('/', validator(Controller.get, SaldoSchema.get()));

module.exports = router;