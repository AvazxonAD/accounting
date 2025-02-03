const { Router } = require("express");
const router = Router();

const { validator } = require('../../helper/validator');
const { KassaPrixodSchema } = require('./schema')
const { Controller } = require("./controller");


router.post("/", validator(Controller.create, KassaPrixodSchema.create()))
    .get('/', validator(Controller.get, KassaPrixodSchema.get()))
    .put('/:id', validator(Controller.update, KassaPrixodSchema.update()))
    .delete('/:id', validator(Controller.delete, KassaPrixodSchema.delete()))
    .get('/:id', validator(Controller.getById, KassaPrixodSchema.getById()));


module.exports = router;
