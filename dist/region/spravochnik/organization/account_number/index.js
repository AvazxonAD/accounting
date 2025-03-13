"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  AccountNumberSchema = _require3.AccountNumberSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
var upload = require('@helper/upload');
router.post('/', validator(Controller.create, AccountNumberSchema.create())).post('/import', upload.single('file'), validator(Controller["import"], AccountNumberSchema["import"]())).get('/template', validator(Controller.template)).get('/:id', validator(Controller.getById, AccountNumberSchema.getById())).put('/:id', validator(Controller.update, AccountNumberSchema.update()))["delete"]('/:id', validator(Controller["delete"], AccountNumberSchema.delette())).get('/', validator(Controller.get, AccountNumberSchema.get()));
module.exports = router;