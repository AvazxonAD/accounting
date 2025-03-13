"use strict";

var _require = require("./controller"),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createResponsibleSchema = _require3.createResponsibleSchema,
  getResponsibleSchema = _require3.getResponsibleSchema,
  updateResponsibleSchema = _require3.updateResponsibleSchema,
  getByIdResponsibleSchema = _require3.getByIdResponsibleSchema,
  deleteResponsibleSchema = _require3.deleteResponsibleSchema,
  ResponsibleSchema = _require3.ResponsibleSchema;
var upload = require('@helper/upload');
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.createResponsible, createResponsibleSchema)).post('/import', upload.single('file'), validator(Controller["import"], ResponsibleSchema.importFile())).get('/template', validator(Controller.template)).get('/:id', validator(Controller.getById, getByIdResponsibleSchema)).put('/:id', validator(Controller.updateResponsible, updateResponsibleSchema))["delete"]('/:id', validator(Controller.deleteResponsible, deleteResponsibleSchema)).get('/', validator(Controller.get, getResponsibleSchema));
module.exports = router;