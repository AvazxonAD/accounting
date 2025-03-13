"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require("./budjet_name.controller"),
  createBudjet = _require2.createBudjet,
  getBudjet = _require2.getBudjet,
  updateBudjet = _require2.updateBudjet,
  deleteBudjet = _require2.deleteBudjet,
  getById = _require2.getById;
router.post("/", createBudjet);
router.get("/", getBudjet);
router.put("/:id", updateBudjet);
router["delete"]("/:id", deleteBudjet);
router.get("/:id", getById);
module.exports = router;