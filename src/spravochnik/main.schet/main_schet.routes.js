const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const { police } = require('../../middleware/police')
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
  getByBudjetIdMainSchet
} = require("./main_schet.controller");

router.post("/", protect, police('spravochnik'), create)
  .get("/", protect, police('spravochnik'), getAll)
  .put("/:id", protect, police('spravochnik'), update)
  .delete("/:id", protect, police('spravochnik'), deleteValue)
  .get("/:id", protect, police('spravochnik'), getElementById)
  .get('/budjet/region/', getByBudjetIdMainSchet);

module.exports = router;
