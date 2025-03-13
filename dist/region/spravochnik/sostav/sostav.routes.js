"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require("@middleware/auth"),
  protect = _require2.protect;
var _require3 = require("./sostav.controller"),
  createSostav = _require3.createSostav,
  getSostav = _require3.getSostav,
  updateSostav = _require3.updateSostav,
  deleteSostav = _require3.deleteSostav,
  getById = _require3.getById;
var upload = require("@utils/protect.file");
router.post("/", createSostav);
router.get("/", getSostav);
router.put("/:id", updateSostav);
router["delete"]("/:id", deleteSostav);
router.get("/:id", getById);
module.exports = router;