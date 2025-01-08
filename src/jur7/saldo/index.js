const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    createSaldoSchema,
    getSaldoSchema,
    updateSaldoSchema,
    getInfoSaldoSchema,
    deleteSaldoSchema,
    getByIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createSaldo, createSaldoSchema))
    .get('/info', validator(Controller.getInfo, getInfoSaldoSchema))
    .get('/id', validator(Controller.getByIdSaldo, getByIdSchema))
    .get('/', validator(Controller.getSaldo, getSaldoSchema))
    .put('/', validator(Controller.updateSaldo, updateSaldoSchema))
    .delete('/', validator(Controller.deleteSaldo, deleteSaldoSchema));


module.exports = router;