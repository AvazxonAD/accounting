"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  RasxodSchema = _require3.RasxodSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.create, RasxodSchema.create())).get('/:id', validator(Controller.getById, RasxodSchema.getById())).put('/:id', validator(Controller.update, RasxodSchema.update()))["delete"]('/:id', validator(Controller["delete"], RasxodSchema["delete"]())).get('/', validator(Controller.get, RasxodSchema.get()));
module.exports = router;