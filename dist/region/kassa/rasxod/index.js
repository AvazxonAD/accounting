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
router.post("/", validator(Controller.create, KassaRasxodSchema.create())).get('/', validator(Controller.get, KassaRasxodSchema.get())).put('/:id', validator(Controller.update, KassaRasxodSchema.update()))["delete"]('/:id', validator(Controller["delete"], KassaRasxodSchema["delete"]())).get('/:id', validator(Controller.getById, KassaRasxodSchema.getById()));
module.exports = router;