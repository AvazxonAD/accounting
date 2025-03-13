"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  OrganizationSchema = _require3.OrganizationSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
var upload = require('@helper/upload');
router.post('/', validator(Controller.create, OrganizationSchema.create())).post('/import', upload.single('file'), validator(Controller["import"], OrganizationSchema["import"]())).put('/parent', validator(Controller.setParentId, OrganizationSchema.setParentId())).get('/template', validator(Controller.template)).get('/:id', validator(Controller.getById, OrganizationSchema.getById())).put('/:id', validator(Controller.update, OrganizationSchema.update()))["delete"]('/:id', validator(Controller["delete"], OrganizationSchema.delette())).get('/', validator(Controller.get, OrganizationSchema.get()));
module.exports = router;