"use strict";

var _require = require('express'),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./controller'),
  Controller = _require3.Controller;
var upload = require('@helper/upload.js');
var _require4 = require('./schema'),
  createSchema = _require4.createSchema,
  getSchema = _require4.getSchema,
  getByIdSchema = _require4.getByIdSchema,
  deleteSchema = _require4.deleteSchema,
  updateSchema = _require4.updateSchema;
router.get("/:id", validator(Controller.getById, getByIdSchema));
router.get("/", validator(Controller.getSmeta, getSchema));
router.post("/import", upload.single('file'), validator(Controller.importSmetaData));
router.post("/", validator(Controller.createSmeta, createSchema));
router.put("/:id", validator(Controller.updateSmeta, updateSchema));
router["delete"]("/:id", validator(Controller.deleteSmeta, deleteSchema));
module.exports = router;