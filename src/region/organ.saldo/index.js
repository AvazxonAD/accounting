const { Router } = require("express");
const router = Router();

const { validator } = require('@helper/validator');
const { OrganSaldoSchema } = require('./schema')
const { Controller } = require("./controller");


router.post("/", validator(Controller.create, OrganSaldoSchema.create()))
    .get('/', validator(Controller.get, OrganSaldoSchema.get()))
    .put('/:id', validator(Controller.update, OrganSaldoSchema.update()))
    .delete('/:id', validator(Controller.delete, OrganSaldoSchema.delete()))
    .get('/:id', validator(Controller.getById, OrganSaldoSchema.getById()));

module.exports = router;
