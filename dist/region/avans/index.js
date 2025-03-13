"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  AktSchema = _require3.AktSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.create, AktSchema.create()));
router.get('/:id', validator(Controller.getById, AktSchema.getById()));
router.put('/:id', validator(Controller.update, AktSchema.update()));
router["delete"]('/:id', validator(Controller["delete"], AktSchema["delete"]()));
router.get('/', validator(Controller.get, AktSchema.get()));
module.exports = router;