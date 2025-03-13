"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require("./schema"),
  createDocSchema = _require3.createDocSchema,
  getDocSchema = _require3.getDocSchema,
  updateDocSchema = _require3.updateDocSchema,
  getByIdDocSchema = _require3.getByIdDocSchema,
  deleteDocSchema = _require3.deleteDocSchema,
  getBySchetSchema = _require3.getBySchetSchema,
  DocSchema = _require3.DocSchema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.post('/', validator(Controller.createDoc, createDocSchema)).get('/id', validator(Controller.getByIdDoc, getByIdDocSchema)).put('/', validator(Controller.updateDoc, updateDocSchema))["delete"]('/', validator(Controller.deleteDoc, deleteDocSchema)).get('/by/schet', validator(Controller.getBySchetSumma, getBySchetSchema)).get('/auto', validator(Controller.auto, DocSchema.auto())).get('/', validator(Controller.getDoc, getDocSchema));
module.exports = router;