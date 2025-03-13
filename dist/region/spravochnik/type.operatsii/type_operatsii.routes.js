"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require("@middleware/auth"),
  protect = _require2.protect;
var _require3 = require("./type_operatsii.controller"),
  createTypeOperatsii = _require3.createTypeOperatsii,
  getTypeOperatsii = _require3.getTypeOperatsii,
  updateTypeOperatsii = _require3.updateTypeOperatsii,
  deleteTypeOperatsii = _require3.deleteTypeOperatsii,
  getById = _require3.getById;
var upload = require("@utils/protect.file");
router.post("/", createTypeOperatsii);
router.get("/", getTypeOperatsii);
router.put("/:id", updateTypeOperatsii);
router["delete"]("/:id", deleteTypeOperatsii);
router.get("/:id", getById);
module.exports = router;