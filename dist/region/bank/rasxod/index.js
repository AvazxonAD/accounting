"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./schema'),
  BankRasxodSchema = _require3.BankRasxodSchema;
var _require4 = require("./controller"),
  Controller = _require4.Controller;
router.post("/", validator(Controller.create, BankRasxodSchema.create())).get('/', validator(Controller.get, BankRasxodSchema.get())).put('/payment/:id', validator(Controller.payment, BankRasxodSchema.payment())).get('/fio', validator(Controller.fio, BankRasxodSchema.fio())).put('/:id', validator(Controller.update, BankRasxodSchema.update()))["delete"]('/:id', validator(Controller["delete"], BankRasxodSchema["delete"]())).get('/:id', validator(Controller.getById, BankRasxodSchema.getById()));
module.exports = router;