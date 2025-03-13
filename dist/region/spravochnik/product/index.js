"use strict";

var _require = require("./controller"),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  getByIdNaimenovanieSchema = _require3.getByIdNaimenovanieSchema,
  getNaimenovanieSchema = _require3.getNaimenovanieSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/', validator(Controller.get, getNaimenovanieSchema));
router.get('/:id', validator(Controller.getById, getByIdNaimenovanieSchema));
module.exports = router;