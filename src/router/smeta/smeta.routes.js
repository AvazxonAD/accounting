const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
  create,
  getAll,
  update,
  deleteValue,
  getElementById,
} = require("../../controller/smeta/smeta.controller");

router.post("/", protect, create);
router.get("/", protect, getAll);
router.put("/:id", protect, update);
router.delete("/:id", protect, deleteValue);
router.get("/:id", protect, getElementById);

module.exports = router;
