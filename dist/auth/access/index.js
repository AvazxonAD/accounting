"use strict";

var _require = require('express'),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./service'),
  AccessService = _require3.AccessService;
var _require4 = require('./schema'),
  updateAccessSchema = _require4.updateAccessSchema,
  getByRoleIdAccessSchema = _require4.getByRoleIdAccessSchema;
router.get('/', validator(AccessService.getByRoleIdAccess, getByRoleIdAccessSchema));
router.put('/:id', validator(AccessService.updateAccess, updateAccessSchema));
module.exports = router;