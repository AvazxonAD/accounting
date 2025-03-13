"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('./schema'),
  createSchema = _require2.createSchema,
  getByIdSchema = _require2.getByIdSchema,
  updateSchema = _require2.updateSchema,
  deleteSchema = _require2.deleteSchema,
  RegionSchema = _require2.RegionSchema;
var _require3 = require('express'),
  Router = _require3.Router;
var router = Router();
var _require4 = require('@helper/validator'),
  validator = _require4.validator;
router.post('/', validator(Controller.createRegion, createSchema)).get('/', validator(Controller.getRegion, RegionSchema.get())).get('/:id', validator(Controller.getById, getByIdSchema))["delete"]('/:id', validator(Controller.deleteRegion, deleteSchema)).put('/:id', validator(Controller.updateRegion, updateSchema));
module.exports = router;