"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var upload = require("@utils/protect.file");
var _require2 = require("./podotchet_litso.controller"),
  createPodotchetLitso = _require2.createPodotchetLitso,
  getPodotchetLitso = _require2.getPodotchetLitso,
  updatePodotchetLitso = _require2.updatePodotchetLitso,
  deletePodotchetLitso = _require2.deletePodotchetLitso,
  getByIdPodotchetLitso = _require2.getByIdPodotchetLitso;
router.post("/", createPodotchetLitso);
router.get("/", getPodotchetLitso);
router.put("/:id", updatePodotchetLitso);
router["delete"]("/:id", deletePodotchetLitso);
router.get("/:id", getByIdPodotchetLitso);
module.exports = router;