"use strict";

var _require = require("./service"),
  UnitService = _require.UnitService;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createUnitSchema = _require3.createUnitSchema,
  getUnitSchema = _require3.getUnitSchema,
  updateUnitSchema = _require3.updateUnitSchema,
  getByIdUnitSchema = _require3.getByIdUnitSchema,
  deleteUnitSchema = _require3.deleteUnitSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(UnitService.createUnit, createUnitSchema));
router.get('/:id', validator(UnitService.getByIdUnit, getByIdUnitSchema));
router.put('/:id', validator(UnitService.updateUnit, updateUnitSchema));
router["delete"]('/:id', validator(UnitService.deleteUnit, deleteUnitSchema));
router.get('/', validator(UnitService.getUnit, getUnitSchema));
module.exports = router;