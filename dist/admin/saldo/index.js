"use strict";

var _require = require('express'),
  Router = _require.Router;
var router = Router();
var _require2 = require('./controller'),
  Controller = _require2.Controller;
var _require3 = require('@helper/validator'),
  validator = _require3.validator;
var _require4 = require("./schema"),
  SaldoSchema = _require4.SaldoSchema;
router.get('/', validator(Controller.get, SaldoSchema.get()));
module.exports = router;