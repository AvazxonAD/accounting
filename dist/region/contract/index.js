"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require("@contract/controller"),
  Controller = _require2.Controller;
var _require3 = require('@helper/validator'),
  validator = _require3.validator;
var _require4 = require('@contract/schema'),
  ContractSchema = _require4.ContractSchema;
router.post("/", validator(Controller.create, ContractSchema.create())).get("/", validator(Controller.get, ContractSchema.get())).get("/:id", validator(Controller.getById, ContractSchema.getById())).put("/:id", validator(Controller.update, ContractSchema.update()))["delete"]("/:id", validator(Controller["delete"], ContractSchema["delete"]()));
module.exports = router;