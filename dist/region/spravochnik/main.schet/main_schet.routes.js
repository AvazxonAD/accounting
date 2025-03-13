"use strict";

var _require = require("express"),
  Router = _require.Router;
var router = Router();
var _require2 = require("@middleware/auth"),
  protect = _require2.protect;
var _require3 = require('@middleware/police'),
  police = _require3.police;
var _require4 = require("./main_schet.controller"),
  create = _require4.create,
  getAll = _require4.getAll,
  update = _require4.update,
  deleteValue = _require4.deleteValue,
  getElementById = _require4.getElementById,
  getByBudjetIdMainSchet = _require4.getByBudjetIdMainSchet;
router.post("/", protect, police('spravochnik'), create).get("/", protect, police('spravochnik'), getAll).put("/:id", protect, police('spravochnik'), update)["delete"]("/:id", protect, police('spravochnik'), deleteValue).get("/:id", protect, police('spravochnik'), getElementById).get('/budjet/region/', getByBudjetIdMainSchet);
module.exports = router;