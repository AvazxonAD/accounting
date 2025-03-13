"use strict";

var _require = require("./service"),
  PereotsenkaService = _require.PereotsenkaService;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createPereotsenkaSchema = _require3.createPereotsenkaSchema,
  getPereotsenkaSchema = _require3.getPereotsenkaSchema,
  updatePereotsenkaSchema = _require3.updatePereotsenkaSchema,
  getByIdPereotsenkaSchema = _require3.getByIdPereotsenkaSchema,
  deletePereotsenkaSchema = _require3.deletePereotsenkaSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(PereotsenkaService.createPereotsenka, createPereotsenkaSchema));
router.get('/:id', validator(PereotsenkaService.getByIdPereotsenka, getByIdPereotsenkaSchema));
router.put('/:id', validator(PereotsenkaService.updatePereotsenka, updatePereotsenkaSchema));
router["delete"]('/:id', validator(PereotsenkaService.deletePereotsenka, deletePereotsenkaSchema));
router.get('/', validator(PereotsenkaService.getPereotsenka, getPereotsenkaSchema));
module.exports = router;