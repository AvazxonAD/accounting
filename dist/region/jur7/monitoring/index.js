"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  Schema = _require3.Schema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/obrotka/report', validator(Controller.obrotkaReport, Schema.getObrotkaSchema())).get('/cap/report', validator(Controller.cap, Schema.capSchema())).get('/cap/back/report', validator(Controller.backCap, Schema.backCapSchema())).get('/saldo', validator(Controller.getSaldo, Schema.getSaldoSchema())).get('/material/report', validator(Controller.materialReport, Schema.getMaterialSchema()));
module.exports = router;