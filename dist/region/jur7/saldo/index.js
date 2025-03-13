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
var upload = require('@helper/upload');
var _require5 = require('@middleware/index'),
  Middleware = _require5.Middleware;
router.post('/import', Middleware.jur7Block, upload.single('file'), validator(Controller["import"], SaldoSchema["import"]()))["delete"]('/', Middleware.jur7Block, validator(Controller["delete"], SaldoSchema["delete"]())).post('/', validator(Controller.create, SaldoSchema.create())).put('/iznos_summa/:id', validator(Controller.updateIznosSumma, SaldoSchema.updateIznosSumma())).get('/temlate', Middleware.jur7Block, Controller.templateFile)
// .delete('/:id', Middleware.jur7Block, validator(Controller.deleteById, SaldoSchema.deleteById()))
.get('/check', validator(Controller.check, SaldoSchema.check())).get('/:id', validator(Controller.getById, SaldoSchema.getById())).get('/', Middleware.jur7Block, validator(Controller.get, SaldoSchema.get()));
module.exports = router;