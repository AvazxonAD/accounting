const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
} = require("../../controller/spravochnik/main_schet.controller");

router.post("/create", protect, create);
router.get("/get/all", protect, getAll);
router.put("/update/:id", protect, update);
router.delete("/delete/:id", protect, deleteValue);
router.get("/get/element/by/:id", protect, getElementById);

module.exports = router;
