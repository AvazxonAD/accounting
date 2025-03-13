"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createReportSchema = _require3.createReportSchema,
  getReportSchema = _require3.getReportSchema,
  updateReportSchema = _require3.updateReportSchema,
  getInfoReportSchema = _require3.getInfoReportSchema,
  deleteReportSchema = _require3.deleteReportSchema,
  getByIdSchema = _require3.getByIdSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.createReport, createReportSchema)).get('/info', validator(Controller.getInfo, getInfoReportSchema)).get('/id', validator(Controller.getByIdReport, getByIdSchema)).get('/', validator(Controller.getReport, getReportSchema)).put('/', validator(Controller.updateReport, updateReportSchema))["delete"]('/', validator(Controller.deleteReport, deleteReportSchema));
module.exports = router;