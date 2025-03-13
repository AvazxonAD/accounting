"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require('@helper/validator'),
  validator = _require2.validator;
var _require3 = require('./schema'),
  OperatsiiSchema = _require3.OperatsiiSchema;
var _require4 = require("./controller"),
  createOperatsii = _require4.createOperatsii,
  getOperatsii = _require4.getOperatsii,
  updateOperatsii = _require4.updateOperatsii,
  deleteOperatsii = _require4.deleteOperatsii,
  getByIdOperatsii = _require4.getByIdOperatsii,
  getSchet = _require4.getSchet,
  Controller = _require4.Controller;
router.get('/schet', getSchet).get("/unique", validator(Controller.uniqueSchets, OperatsiiSchema.uniqueSchets())).get("/:id", getByIdOperatsii).post("/", createOperatsii).get("/", getOperatsii).get('/template').put("/:id", updateOperatsii)["delete"]("/:id", deleteOperatsii);
module.exports = router;