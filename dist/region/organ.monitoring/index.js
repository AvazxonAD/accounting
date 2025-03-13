"use strict";

var _require = require('./controllers'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./schemas'),
  monitoringSchema = _require3.monitoringSchema,
  aktSverkaSchema = _require3.aktSverkaSchema,
  prixodRasxodSchema = _require3.prixodRasxodSchema,
  capSchema = _require3.capSchema,
  consolidatedSchema = _require3.consolidatedSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/cap', validator(Controller.cap, capSchema)).get('/', validator(Controller.monitoring, monitoringSchema)).get('/prixod/rasxod', validator(Controller.prixodRasxod, prixodRasxodSchema)).get('/order', validator(Controller.consolidated, consolidatedSchema));
//.get('/akt/sverka', validator(Controller.aktSverka, aktSverkaSchema))

module.exports = router;