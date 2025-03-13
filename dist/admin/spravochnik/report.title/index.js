"use strict";

var _require = require("./controller"),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createSchema = _require3.createSchema,
  getSchema = _require3.getSchema,
  updateSchema = _require3.updateSchema,
  getByIdSchema = _require3.getByIdSchema,
  deleteSchema = _require3.deleteSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.create, createSchema)).get('/:id', validator(Controller.getById, getByIdSchema)).put('/:id', validator(Controller.update, updateSchema))["delete"]('/:id', validator(Controller["delete"], deleteSchema)).get('/', validator(Controller.get, getSchema));
module.exports = router;