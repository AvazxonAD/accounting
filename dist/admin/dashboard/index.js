"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  DashboardSchema = _require3.DashboardSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/budjet', validator(Controller.budjet)).get('/kassa', validator(Controller.kassa, DashboardSchema.kassa())).get('/podotchet', validator(Controller.podotchet, DashboardSchema.podotchet())).get('/bank', validator(Controller.bank, DashboardSchema.bank()));
module.exports = router;