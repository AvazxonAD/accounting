"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var upload = require("@utils/protect.file");
var _require2 = require("@middleware/auth"),
  protect = _require2.protect;
var _require3 = require("./podrazdelenie.controller"),
  createPodrazdelenie = _require3.createPodrazdelenie,
  getPodrazdelenie = _require3.getPodrazdelenie,
  updatePodrazdelenie = _require3.updatePodrazdelenie,
  deletePodrazdelenie = _require3.deletePodrazdelenie,
  getByIdPodrazdelenie = _require3.getByIdPodrazdelenie;
router.post("/", createPodrazdelenie);
router.get("/", getPodrazdelenie);
router.put("/:id", updatePodrazdelenie);
router["delete"]("/:id", deletePodrazdelenie);
router.get("/:id", getByIdPodrazdelenie);
module.exports = router;