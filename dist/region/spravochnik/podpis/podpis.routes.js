"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require("./podpis.controller"),
  getByIdpodpis = _require2.getByIdpodpis,
  createpodpis = _require2.createpodpis,
  getpodpis = _require2.getpodpis,
  deletepodpis = _require2.deletepodpis,
  updatepodpis = _require2.updatepodpis;
router.post("/", createpodpis);
router.get("/", getpodpis);
router.put("/:id", updatepodpis);
router["delete"]("/:id", deletepodpis);
router.get("/:id", getByIdpodpis);
module.exports = router;