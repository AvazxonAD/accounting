"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./schema'),
  OrganSaldoSchema = _require3.OrganSaldoSchema;
var _require4 = require("./controller"),
  Controller = _require4.Controller;
router.post("/", validator(Controller.create, OrganSaldoSchema.create())).get('/', validator(Controller.get, OrganSaldoSchema.get())).put('/:id', validator(Controller.update, OrganSaldoSchema.update()))["delete"]('/:id', validator(Controller["delete"], OrganSaldoSchema["delete"]())).get('/:id', validator(Controller.getById, OrganSaldoSchema.getById()));
module.exports = router;