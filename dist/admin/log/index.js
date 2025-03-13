"use strict";

var _require = require('./service'),
  LogService = _require.LogService;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  getSchema = _require3.getSchema,
  getUserSchema = _require3.getUserSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/get', validator(LogService.getLogs, getSchema));
router.get('/user/:id', validator(LogService.getUser, getUserSchema));
module.exports = router;