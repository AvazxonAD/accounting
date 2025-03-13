"use strict";

var _require = require('@helper/validator'),
  validator = _require.validator;
var _require2 = require('./service'),
  AuthService = _require2.AuthService;
var _require3 = require('@middleware/auth'),
  protect = _require3.protect;
var _require4 = require('./schema'),
  loginSchema = _require4.loginSchema,
  updateSchema = _require4.updateSchema;
var _require5 = require('express'),
  Router = _require5.Router;
var router = Router();
router.post('/', validator(AuthService.loginAuth, loginSchema)).patch('/', protect, validator(AuthService.updateAuth, updateSchema));
module.exports = router;