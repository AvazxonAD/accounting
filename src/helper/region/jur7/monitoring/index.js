const { Controller } = require('./controller');
const { validator } = require('@helper/validator');
const { Schema } = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/obrotka/report', validator(Controller.obrotkaReport, Schema.getObrotkaSchema()))
    .get('/cap/report', validator(Controller.cap, Schema.capSchema()))
    .get('/cap/back/report', validator(Controller.backCap, Schema.backCapSchema()))
    .get('/saldo', validator(Controller.getSaldo, Schema.getSaldoSchema()))
    .get('/material/report', validator(Controller.materialReport, Schema.getMaterialSchema()));

module.exports = router;