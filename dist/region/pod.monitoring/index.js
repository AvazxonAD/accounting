"use strict";

var _require = require('express'),
  Router = _require.Router;
var router = Router();
var _require2 = require('./schemas'),
  monitoringSchema = _require2.monitoringSchema,
  prixodRasxodSchema = _require2.prixodRasxodSchema,
  getByIdPodotchetToExcelSchema = _require2.getByIdPodotchetToExcelSchema,
  capSchema = _require2.capSchema;
var _require3 = require('./controllers'),
  Controller = _require3.Controller;
var _require4 = require('@helper/validator'),
  validator = _require4.validator;
router.get('/', validator(Controller.getMonitoring, monitoringSchema)).get('/prixod/rasxod', validator(Controller.prixodRasxodPodotchet, prixodRasxodSchema)).get('/cap', validator(Controller.cap, capSchema)).get('/export/:id', validator(Controller.getByIdPodotchetToExcel, getByIdPodotchetToExcelSchema));
module.exports = router;