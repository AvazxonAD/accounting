"use strict";

var _require = require("./controller"),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createMainBookSchetSchema = _require3.createMainBookSchetSchema,
  getMainBookSchetSchema = _require3.getMainBookSchetSchema,
  updateMainBookSchetSchema = _require3.updateMainBookSchetSchema,
  getByIdMainBookSchetSchema = _require3.getByIdMainBookSchetSchema,
  deleteMainBookSchetSchema = _require3.deleteMainBookSchetSchema;
var upload = require('@helper/upload');
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.createMainBookSchet, createMainBookSchetSchema)).get('/:id', validator(Controller.getByIdMainBookSchet, getByIdMainBookSchetSchema)).post('/import', upload.single('file'), validator(Controller.importSmetaData)).put('/:id', validator(Controller.updateMainBookSchet, updateMainBookSchetSchema))["delete"]('/:id', validator(Controller.deleteMainBookSchet, deleteMainBookSchetSchema)).get('/', validator(Controller.getMainBookSchet, getMainBookSchetSchema));
module.exports = router;