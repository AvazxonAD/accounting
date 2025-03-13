"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./schema'),
  KassaRasxodSchema = _require3.KassaRasxodSchema;
var _require4 = require("./controller"),
  Controller = _require4.Controller;
router.get('/', validator(Controller.get, KassaRasxodSchema.get())).get('/daily', validator(Controller.daily, KassaRasxodSchema.daily())).get('/cap', validator(Controller.cap, KassaRasxodSchema.cap()));
module.exports = router;