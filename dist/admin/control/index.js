"use strict";

var _require = require('./service'),
  ControlService = _require.ControlService;
var _require2 = require('./schema'),
  controlSchema = _require2.controlSchema;
var _require3 = require('express'),
  Router = _require3.Router;
var router = Router();
var _require4 = require('@helper/validator'),
  validator = _require4.validator;
router.get('/tables/count', validator(ControlService.getControl));
module.exports = router;