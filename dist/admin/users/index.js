"use strict";

var _require = require('@helper/validator'),
  validator = _require.validator;
var _require2 = require('./service'),
  AdminService = _require2.AdminService;
var _require3 = require('./schema'),
  createSchema = _require3.createSchema,
  updateSchema = _require3.updateSchema,
  getByIdSchema = _require3.getByIdSchema,
  deleteSchema = _require3.deleteSchema,
  getSchema = _require3.getSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(AdminService.createAdmin, createSchema)).get('/', validator(AdminService.getAdmin, getSchema)).get('/:id', validator(AdminService.getByIdAdmin, getByIdSchema))["delete"]('/:id', validator(AdminService.deleteAdmin, deleteSchema)).put('/:id', validator(AdminService.updateAdmin, updateSchema));
module.exports = router;