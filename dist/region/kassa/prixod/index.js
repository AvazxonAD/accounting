"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./schema'),
  KassaPrixodSchema = _require3.KassaPrixodSchema;
var _require4 = require("./controller"),
  Controller = _require4.Controller;
router.post("/", validator(Controller.create, KassaPrixodSchema.create())).get('/', validator(Controller.get, KassaPrixodSchema.get())).put('/:id', validator(Controller.update, KassaPrixodSchema.update()))["delete"]('/:id', validator(Controller["delete"], KassaPrixodSchema["delete"]())).get('/:id', validator(Controller.getById, KassaPrixodSchema.getById()));
module.exports = router;