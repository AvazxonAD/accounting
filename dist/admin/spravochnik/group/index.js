"use strict";

var _require = require("./controller"),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var upload = require('@helper/upload');
var _require3 = require("./schema"),
  createSchema = _require3.createSchema,
  getSchema = _require3.getSchema,
  updateSchema = _require3.updateSchema,
  getByIdGroupSchema = _require3.getByIdGroupSchema,
  deleteSchema = _require3.deleteSchema,
  GroupSchema = _require3.GroupSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/percent', Controller.getWithPercent).get('/template', validator(Controller.templateFile)).get('/export', validator(Controller["export"])).post('/import', upload.single('file'), validator(Controller["import"], GroupSchema["import"]())).post('/', validator(Controller.create, createSchema)).get('/:id', validator(Controller.getById, getByIdGroupSchema)).put('/:id', validator(Controller.update, updateSchema))["delete"]('/:id', validator(Controller["delete"], deleteSchema)).get('/', validator(Controller.get, getSchema));
module.exports = router;