const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
  getByBudjetIdMainSchet
} = require("../../controller/spravochnik/main_schet.controller");

router.post("/", protect, create)
  .get("/", protect, getAll)
  .put("/:id", protect, update)
  .delete("/:id", protect, deleteValue)
  .get("/:id", protect, getElementById)
  .get('/budjet/region/', getByBudjetIdMainSchet);

module.exports = router;
