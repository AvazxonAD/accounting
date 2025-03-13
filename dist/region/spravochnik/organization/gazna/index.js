"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  GaznaSchema = _require3.GaznaSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
var upload = require('@helper/upload');
router.post('/', validator(Controller.create, GaznaSchema.create())).post('/import', upload.single('file'), validator(Controller["import"], GaznaSchema["import"]())).get('/template', validator(Controller.template)).get('/:id', validator(Controller.getById, GaznaSchema.getById())).put('/:id', validator(Controller.update, GaznaSchema.update()))["delete"]('/:id', validator(Controller["delete"], GaznaSchema.delette())).get('/', validator(Controller.get, GaznaSchema.get()));
module.exports = router;