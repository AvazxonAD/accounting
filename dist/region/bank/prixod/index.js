"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./schema'),
  BankPrixodSchema = _require3.BankPrixodSchema;
var _require4 = require("./controller"),
  Controller = _require4.Controller;
router.post("/", validator(Controller.create, BankPrixodSchema.create())).get('/', validator(Controller.get, BankPrixodSchema.get())).put('/:id', validator(Controller.update, BankPrixodSchema.update()))["delete"]('/:id', validator(Controller["delete"], BankPrixodSchema["delete"]())).get('/:id', validator(Controller.getById, BankPrixodSchema.getById()));
module.exports = router;