const { Router } = require("express");
const router = Router();

const { validator } = require('../../helper/validator');
const { BankRasxodSchema } = require('./schema')
const { Controller } = require("./controller");


router.post("/", validator(Controller.create, BankRasxodSchema.create()))
    .get('/', validator(Controller.get, BankRasxodSchema.get()))
    .get('/fio', validator(Controller.fio, BankRasxodSchema.fio()))
    .put('/:id', validator(Controller.update, BankRasxodSchema.update()))
    .delete('/:id', validator(Controller.delete, BankRasxodSchema.delete()))
    .get('/:id', validator(Controller.getById, BankRasxodSchema.getById()));


module.exports = router;
