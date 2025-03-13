"use strict";

var _require = require('express'),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./controller'),
  Controller = _require3.Controller;
var _require4 = require('./schema'),
  createSchema = _require4.createSchema,
  getSchema = _require4.getSchema,
  getByIdSchema = _require4.getByIdSchema,
  deleteSchema = _require4.deleteSchema,
  updateSchema = _require4.updateSchema;
router.get("/:id", validator(Controller.getByIdSmetaGrafik, getByIdSchema));
router.get("/", validator(Controller.getSmetaGrafik, getSchema));
router.post("/", validator(Controller.createSmetaGrafik, createSchema));
router.put("/:id", validator(Controller.updateSmetaGrafik, updateSchema));
router["delete"]("/:id", validator(Controller.deleteSmetGrafik, deleteSchema));
module.exports = router;