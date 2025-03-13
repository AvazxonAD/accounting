"use strict";

var _require = require('./controller'),
  Controller = _require.Controller;
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var upload = require('@helper/upload');
var _require3 = require("./schema"),
  PrixodJur7Schema = _require3.PrixodJur7Schema;
var _require4 = require('express'),
  Router = _require4.Router;
var router = Router();
router.get('/docs/:id', validator(Controller.rasxodDocs, PrixodJur7Schema.rasxodDocs())).get('/report', validator(Controller.getPrixodReport, PrixodJur7Schema.report())).get('/template', validator(Controller.templateImport)).post('/', validator(Controller.create, PrixodJur7Schema.create())).post('/read', upload.single('file'), validator(Controller.readFile, PrixodJur7Schema.readFile())).get('/:id', validator(Controller.getById, PrixodJur7Schema.getById())).put('/:id', validator(Controller.update, PrixodJur7Schema.update()))["delete"]('/:id', validator(Controller["delete"], PrixodJur7Schema["delete"]())).get('/', validator(Controller.get, PrixodJur7Schema.get()));
module.exports = router;