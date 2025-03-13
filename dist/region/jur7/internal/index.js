"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  InternalSchema = _require3.InternalSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.create, InternalSchema.create())).get('/:id', validator(Controller.getById, InternalSchema.getById())).put('/:id', validator(Controller.update, InternalSchema.update()))["delete"]('/:id', validator(Controller["delete"], InternalSchema["delete"]())).get('/', validator(Controller.get, InternalSchema.get()));
module.exports = router;