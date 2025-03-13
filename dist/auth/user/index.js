"use strict";

var _require = require('@helper/validator'),
  validator = _require.validator;
var _require2 = require('./service'),
  UserService = _require2.UserService;
var _require3 = require('./schema'),
  createSchema = _require3.createSchema,
  updateSchema = _require3.updateSchema,
  getByIdSchema = _require3.getByIdSchema,
  deleteSchema = _require3.deleteSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(UserService.createUser, createSchema)).get('/', validator(UserService.getUser)).get('/:id', validator(UserService.getByIdUser, getByIdSchema))["delete"]('/:id', validator(UserService.deleteUser, deleteSchema)).put('/:id', validator(UserService.updateUser, updateSchema));
module.exports = router;