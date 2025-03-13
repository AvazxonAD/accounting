"use strict";

var _require = require('@helper/validator'),
  validator = _require.validator;
var _require2 = require('./service'),
  RoleService = _require2.RoleService;
var _require3 = require('./schema'),
  createSchema = _require3.createSchema,
  updateSchema = _require3.updateSchema,
  getByIdSchema = _require3.getByIdSchema,
  deleteSchema = _require3.deleteSchema,
  RoleSchema = _require3.RoleSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(RoleService.createRole, createSchema)).get('/', validator(RoleService.getRole, RoleSchema.get())).get('/:id', validator(RoleService.getByIdRole, getByIdSchema))["delete"]('/:id', validator(RoleService.deleteRole, deleteSchema)).put('/:id', validator(RoleService.updateRole, updateSchema));
module.exports = router;