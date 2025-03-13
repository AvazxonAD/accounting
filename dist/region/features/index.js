"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  FeaturesSchema = _require3.FeaturesSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/doc/num/:page', validator(Controller.getDocNum, FeaturesSchema.docNum()));
module.exports = router;