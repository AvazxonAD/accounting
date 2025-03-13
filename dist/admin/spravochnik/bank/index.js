"use strict";

var _require = require("./controller"),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createBankSchema = _require3.createBankSchema,
  getBankSchema = _require3.getBankSchema,
  updateBankSchema = _require3.updateBankSchema,
  getByIdBankSchema = _require3.getByIdBankSchema,
  deleteBankSchema = _require3.deleteBankSchema,
  BankSchema = _require3.BankSchema;
var upload = require('@utils/protect.file');
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.create, createBankSchema)).get('/mfo/:mfo', validator(Controller.getByMfo, BankSchema.getByMfo())).get('/:id', validator(Controller.getByIdBankMfo, getByIdBankSchema)).put('/:id', validator(Controller.updateBankMfo, updateBankSchema))["delete"]('/:id', validator(Controller.deleteBankMfo, deleteBankSchema)).get('/', validator(Controller.getBankMfo, getBankSchema)).post('/import', upload.single('file'), validator(Controller.importExcelData));
module.exports = router;